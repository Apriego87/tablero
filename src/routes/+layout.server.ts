
import { db } from "$lib"
import { employee } from "$lib/schema"
import { eq } from "drizzle-orm"
import type { PageServerLoad } from "./$types"


export const load: PageServerLoad = async ({ cookies }) => {
    let logged = false
    let registerRoute = false

    if (cookies.get('auth_session')) {
        logged = true
        const userId = cookies.get('userid')
        if (userId) {
            const employeeRole = await db.select({ rol: employee.role }).from(employee).where(eq(employee.id, userId))
            if (employeeRole[0].rol === 'jefe' || employeeRole[0].rol === 'sysAdmin') {
                registerRoute = true;
            }
        }
    }



    return {
        logged, registerRoute
    }
}

