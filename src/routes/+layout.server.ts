
import { db } from "$lib"
import { employee } from "$lib/schema"
import { eq } from "drizzle-orm"
import type { PageServerLoad } from "./$types"


export const load: PageServerLoad = async ({ cookies }) => {
    let logged = false
    let registerRoute = false
    let username, userId, pfp

    if (cookies.get('auth_session')) {
        logged = true
        userId = cookies.get('userid')
        if (userId) {
            const user = await db.select({ username: employee.username, rol: employee.role, pfp: employee.pfp }).from(employee).where(eq(employee.id, userId))
            username = user[0].username
            pfp = user[0].pfp
            if (user[0].rol === 'jefe' || user[0].rol === 'sysAdmin') {
                registerRoute = true;
            }
        }
    }



    return {
        logged, registerRoute, username, userId, pfp
    }
}

