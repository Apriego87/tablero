import { fail, redirect } from "@sveltejs/kit";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { db } from "$lib";

import type { Actions } from "./$types";
import { employee } from "$lib/schema";

import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { eq } from "drizzle-orm";
import { auth } from "$lib/server/auth";

const schema = z.object({
    name: z.string(),
    surname: z.string(),
    username: z.string().min(4).max(31).regex(new RegExp(/^[a-zA-Z0-9_]+$/), {
        message: 'El usuario solo puede contener letras minúsculas, números o guión bajo',
    }),
    password: z.string().min(8).max(50),
    confirmPassword: z.string().min(8).max(50),
    email: z.string().email(),
    role: z.enum(['jefe', 'encargado', 'programador', 'sysAdmin']),
    department: z.string(),
    location: z.string(),
    // pfp: z.string().optional()
}).refine(
    (values) => {
        return values.password === values.confirmPassword;
    },
    {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    }
);

export const load = (async ({ cookies }) => {
    const userId = cookies.get('userid')
    if (userId) {
        const rol = await db.select({ rol: employee.role }).from(employee).where(eq(employee.id, userId))
        if (rol[0].rol !== 'jefe' && rol[0].rol !== 'sysAdmin') {
            return redirect(302, '/');
        }
    }
    else {
        const data = await db.select().from(employee)
        if (data.length !== 0) {
            return redirect(302, '/');
        } else {
            await db.insert(employee).values({
                id: generateId(15),
                name: 'Admin',
                surname: 'Sistemas',
                username: 'sysAdmin',
                password: await new Argon2id().hash('rootroot'),
                email: 'sysadmin@gmail.com',
                role: 'sysAdmin',
                department: 'informatica',
                location: 'barbastro'
            })
            return redirect(302, '/')
        }
    }
    const form = await superValidate(zod(schema));

    return { form, title: 'Registo de Usuarios' };
});

export const actions: Actions = {
    create: async ({ request }) => {
        const form = await superValidate(request, zod(schema));

        if (!form.valid) {
            return fail(400, { form });
        }
        else {

            const name = (form.data.name as string) || ''
            const surname = (form.data.surname as string) || ''
            const username = (form.data.username as string) || '';
            const password = (form.data.password as string) || '';
            const email = (form.data.email as string) || '';
            const role = (form.data.role as string) || '';
            const department = (form.data.department as string) || '';
            const location = (form.data.location as string) || '';
            // const pfp = (form.data.pfp as string) || '';

            if (((await db.select().from(employee).where(eq(employee.username, username))).toString() != '')) {
                return setError(form, 'username', 'Este usuario ya existe');
            }

            else {
                const employeeID = generateId(15);
                const hashedPassword = await new Argon2id().hash(password);

                await db.insert(employee).values({
                    id: employeeID,
                    name: name,
                    surname: surname,
                    username: username,
                    password: hashedPassword,
                    email: email,
                    role: role,
                    department: department,
                    location: location,
                    pfp: 'https://i.etsystatic.com/34732889/r/il/b08942/3768265623/il_570xN.3768265623_sji1.jpg'
                })

                return redirect(302, "/login");
            }
        }
    },
    signout: async (event) => {
        if (!event.locals.session) {
            return fail(401);
        }
        await auth.invalidateSession(event.locals.session.id);
        const sessionCookie = auth.createBlankSessionCookie();
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            expires: new Date(0),
            path: "/",
            secure: false
        });

        event.cookies.set('userid', '', {
            expires: new Date(0),
            path: '/',
            secure: false
        });

        return redirect(302, "/login");
    }
};