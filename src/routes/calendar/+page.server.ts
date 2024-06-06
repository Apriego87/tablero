import { fail, redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "../$types"
import { db } from "$lib"
import { event } from "$lib/schema"
import { eq } from "drizzle-orm"
import { auth } from "$lib/server/auth"


export const load: PageServerLoad = async ({ cookies }) => {
    if (!cookies.get('auth_session')) {
        return redirect(303, '/login')
    }
    else {
        const events = await db.select().from(event).where(eq(event.creatorID, cookies.get('userid')))

        return {
            title: 'Calendario de Eventos', events
        }
    }
}

export const actions: Actions = {
    create: async ({ request, cookies }) => {
        const data = await request.formData()

        const start: FormDataEntryValue = data.get('start')
        const end: FormDataEntryValue = data.get('end')

        const startDate = new Date(start)
        const endDate = new Date(end)

        const adjustedStartDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000)
        const adjustedEndDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000)

        console.log(adjustedStartDate)

        await db.insert(event).values(
            {
                creatorID: cookies.get('userid'),
                title: data.get('title'),
                description: data.get('description'),
                start: adjustedStartDate,
                end: adjustedEndDate,
                department: data.get('department'),
            }
        )
    }
    ,
    delete: async ({ request }) => {
        const data = await request.formData()

        const id = data.get('eventId')

        await db.delete(event).where(eq(event.id, id))

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

        return redirect(303, '/login');
    }
}