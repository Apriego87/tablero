import { db } from "$lib";
import { employee } from "$lib/schema";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { auth } from "$lib/server/auth";
import { eq } from "drizzle-orm";


export const load: PageServerLoad = async ({ cookies }) => {
    if (!cookies.get('auth_session')) {
        return redirect(303, '/login')
    }
    else {
        let manager = false

        const role = await db.select({ username: employee.username, rol: employee.role }).from(employee).where(eq(employee.id, cookies.get('userid')))
        if (role[0].rol === 'jefe' || role[0].rol === 'sysAdmin') {
            manager = true;
        }

        const users = await db.select().from(employee)

        return {
            users, title: 'Área de Empleados', manager
        }
    }
}

export const actions: Actions = {
    update: async ({ request }) => {
        const data = await request.formData()

        const id = data.get('userid')
        const name = data.get('name')
        const surname = data.get('surname')
        const username = data.get('username')
        const email = data.get('email')
        const role = data.get('role')
        const department = data.get('department')
        const location = data.get('location')

        await db.update(employee).set({ name: name, surname: surname, username: username, email: email, role: role, department: department, location: location }).where(eq(employee.id, id))
    },
    delete: async ({ request }) => {
        const data = await request.formData()
        const id = data.get('userId')

        await db.delete(employee).where(eq(employee.id, id))

        return { success: true }
    },
    signout: async ({ locals, cookies }) => {
        if (!locals.session) {
            return fail(401);
        }
        await auth.invalidateSession(locals.session.id);
        const sessionCookie = auth.createBlankSessionCookie();
        cookies.set(sessionCookie.name, sessionCookie.value, {
            expires: new Date(0),
            path: '/',
            secure: false
        });

        cookies.set('userid', '', {
            expires: new Date(0),
            path: '/',
            secure: false
        });

        return redirect(303, "/login");
    }
}