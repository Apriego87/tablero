import { db } from '$lib';
import { employee, note } from '$lib/schema.js';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from '../$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth.js';

export const load: PageServerLoad = async ({ cookies }) => {
    if (!cookies.get('auth_session')) {
        return redirect(303, '/login')
    }
    else {
        const notes = await db.select().from(note)

        let manager = false

        const role = await db.select({ username: employee.username, rol: employee.role }).from(employee).where(eq(employee.id, cookies.get('userid')))
        if (role[0].rol === 'jefe' || role[0].rol === 'sysAdmin') {
            manager = true;
        }

        await Promise.all(notes.map(async (item) => {
            const creator = await db.select().from(employee).where(eq(employee.id, item.creatorID));
            if (creator.length > 0) {
                item.creatorName = `${creator[0].name} ${creator[0].surname}`;
            }
        }));

        return {
            notes, title: 'Tablón de Anuncios', userID: cookies.get('userid'), manager
        }
    }
}

export const actions = {
    create: async ({ request, cookies }) => {
        const data = await request.formData();

        const userID = await db.select().from(employee).where(eq(employee.id, cookies.get('userid')))

        console.log(String(data.get('category')))

        await db.insert(note).values({
            creatorID: userID[0].id,
            title: String(data.get('title')),
            description: String(data.get('description')),
            category: String(data.get('category'))
        })

        return { success: true };
    },
    edit: async ({ request }) => {
        const data = await request.formData()
        await db.update(note).set({ title: data.get('title'), description: data.get('description') }).where(eq(note.id, data.get('id')))

        return { success: true }
    },
    delete: async ({ request }) => {
        const data = await request.formData()

        const noteID = data.get('noteID')

        await db.delete(note).where(eq(note.id, noteID))

        return { success: true }
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

        return redirect(303, "/login");
    }
};