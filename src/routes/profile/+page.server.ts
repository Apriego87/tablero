import { db } from "$lib"
import { employee } from "$lib/schema"
import { eq } from "drizzle-orm"
import type { PageServerLoad } from "../$types"
import { fail, redirect, type Actions } from "@sveltejs/kit"
import { auth } from "$lib/server/auth"
import { Storage } from '@google-cloud/storage'
import { writeFileSync } from 'fs'

const keyFilename = process.env.NODE_ENV === 'production' ? '/app/keys/dulcet-glyph-422010-n8-619d72f660d9.json' : 'keys/dulcet-glyph-422010-n8-619d72f660d9.json';

const storage = new Storage({
    projectId: 'dulcet-glyph-422010-n8',
    keyFilename: keyFilename
});


export const load: PageServerLoad = async ({ url }) => {
    const id = url.searchParams.get('id')

    const user = await db.select().from(employee).where(eq(employee.id, id))

    return {
        title: 'Tu perfil', user
    }
}

export const actions: Actions = {
    data: async ({ request }) => {
        const data = await request.formData()

        const id = data.get('userid')
        const name = data.get('name')
        const surname = data.get('surname')
        const username = data.get('username')
        const email = data.get('email')
        const role = data.get('role')
        const department = data.get('department')
        const location = data.get('location')

        try {
            await db.update(employee)
                .set({ name, surname, username, email, role, department, location })
                .where(eq(employee.id, id))
        } catch (error) {
            console.error(error)
            return {
                status: 500,
                body: { message: 'Hubo un error en el servidor' }
            }
        }

        return redirect(303, `/profile?id=${id}`)
    },
    pfp: async ({ request, cookies }) => {
        let id
        const formData = Object.fromEntries(await request.formData());

        if (
            !(formData.pfpEdit as File).name ||
            (formData.pfpEdit as File).name === 'undefined'
        ) {
            return fail(400, {
                error: true,
                message: 'Debes añadir un archivo.'
            });
        }

        const { pfpEdit } = formData as { pfpEdit: File };

        writeFileSync(`fileStorage/${pfpEdit.name}`, Buffer.from(await pfpEdit.arrayBuffer()));

        try {
            id = cookies.get('userid')
            const user = await db.select().from(employee).where(eq(employee.id, id));

            const bucket = storage.bucket("gs://tablero-bucket");
            const destination = `${user[0].username}/${pfpEdit.name}`;

            const result = await bucket.upload(`fileStorage/${pfpEdit.name}`, {
                destination: destination,
                public: true,
                metadata: {
                    contentType: pfpEdit.type,
                }
            })

            await db.update(employee).set({ pfp: result[0].metadata.mediaLink }).where(eq(employee.id, id))
        } catch (error) {
            console.log('error: ' + error);
        }

        return redirect(303, `/profile?id=${id}`)
    },
    signout: async ({ locals, cookies }) => {
        if (!locals.session) {
            return fail(400);
        }
        await auth.invalidateSession(locals.session.id);
        const sessionCookie = auth.createBlankSessionCookie();
        cookies.set(sessionCookie.name, sessionCookie.value, {
            expires: new Date(0),
            path: "/",
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