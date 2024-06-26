import { auth } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { Argon2id } from "oslo/password";
import { db } from "$lib";

import type { Actions } from "./$types";
import { employee } from "$lib/schema";
import { eq } from "drizzle-orm";

import { superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
	username: z.string().min(4).max(31).regex(new RegExp(/^[a-zA-Z0-9_]+$/), {
		message: 'El usuario solo puede contener letras minúsculas, dígitos y guiones medios/bajos.'
	}),
	password: z.string().min(8).max(50)
});

export const load = (async ({ cookies }) => {
	const form = await superValidate(zod(schema));

	if (cookies.get('auth_session')) {
		return redirect(302, '/')
	}

	return { form, title: 'Inicio de Sesión' };
});

export const actions: Actions = {
	default: async ({ request, cookies }) => {

		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}
		else {
			const username = (form.data.username as string) || '';
			const password = (form.data.password as string) || '';

			const existingUser = await db.select().from(employee).where(eq(employee.username, username))

			if (existingUser.length === 0) {
				return setError(form, 'username', 'usuario incorrecto')
			}
			else {
				const validPassword = await new Argon2id().verify(existingUser[0].password, password);
				if (!validPassword) {
					return setError(form, 'password', 'contraseña incorrecta')
				}
				else {
					const session = await auth.createSession(existingUser[0].id, {});
					const sessionCookie = auth.createSessionCookie(session.id);

					cookies.set(sessionCookie.name, sessionCookie.value, {
						path: '/',
						secure: false,
					})

					cookies.set('userid', existingUser[0].id, {
						secure: false,
						path: '/'
					})
				}
			}
			return redirect(303, "/");
		}

	}
};