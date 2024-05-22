import { redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "../$types"
import { db } from "$lib"
import { event } from "$lib/schema"
import { eq } from "drizzle-orm"


export const load: PageServerLoad = async ({ cookies }) => {
    if (!cookies.get('auth_session')) {
        return redirect(302, '/login')
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

        console.log(data)
        await db.insert(event).values(
            {
                creatorID: cookies.get('userid'),
                title: data.get('title'),
                description: data.get('description'),
                start: new Date(String(data.get('start'))),
                end: new Date(String(data.get('end'))),
                department: data.get('department'),
            }
        )
    },
    delete: async ({ request }) => {
        const data = await request.formData()

        const id = data.get('eventId')

        await db.delete(event).where(eq(event.id, id))

        return { success: true }
    }
}