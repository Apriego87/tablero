<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Label } from '$lib/components/ui/label'
	import { Input } from '$lib/components/ui/input'
	import * as Card from '$lib/components/ui/card'
	import * as Select from '$lib/components/ui/select'

	import { superForm } from 'sveltekit-superforms'
	import type { PageData } from '../$types'
	export let data: PageData

	const { form, errors, message, enhance } = superForm(data.form, {
		onError({ result }) {
			$message = result.error.message || 'error desconocido'
		}
	})
</script>

<main class="flex h-[88vh] flex-col items-center justify-center">
	<div class="flex h-[85%] w-[90%] lg:w-[65%] flex-row items-center gap-10">
		<Card.Root class="flex w-full h-full md:h-fit lg:h-fit flex-col items-center">
			<Card.Header>
				<Card.Title>
					<p class="text-2xl font-bold">Registrar Usuario</p>
				</Card.Title>
			</Card.Header>
			<Card.Content class="w-full overflow-auto">
				<form method="POST" action="?/create" class="w-full grid grid-cols-1 md:grid-cols-2 gap-4" use:enhance>
					<div class="lg:m-2 w-full lg:p-2">
						<Label for="name">Nombre</Label>
						<Input
							type="text"
							id="name"
							name="name"
							aria-invalid={$errors.name ? 'true' : undefined}
							bind:value={$form.name}
						/>
						{#if $errors.name}
							<small class="invalid">{$errors.name}</small>
						{/if}
					</div>

					<div class="lg:m-2 w-full lg:p-2">
						<Label for="surname">Apellidos</Label>
						<Input
							type="text"
							id="surname"
							name="surname"
							aria-invalid={$errors.surname ? 'true' : undefined}
							bind:value={$form.surname}
						/>
						{#if $errors.surname}
							<small class="invalid">{$errors.surname}</small>
						{/if}
					</div>

					<div class="lg:m-2 w-full lg:p-2">
						<Label for="username">Usuario</Label>
						<Input
							type="text"
							id="username"
							name="username"
							aria-invalid={$errors.username ? 'true' : undefined}
							bind:value={$form.username}
						/>
						{#if $errors.username}
							<small class="invalid">{$errors.username}</small>
						{/if}
					</div>

					<div class="lg:m-2 w-full lg:p-2">
						<Label for="email">E-Mail</Label>
						<Input
							type="email"
							id="email"
							name="email"
							aria-invalid={$errors.email ? 'true' : undefined}
							bind:value={$form.email}
						/>
						{#if $errors.email}
							<small class="invalid">{$errors.email}</small>
						{/if}
					</div>

					<div class="lg:m-2 w-full lg:p-2">
						<Label for="password">Contraseña</Label>
						<Input
							type="password"
							id="password"
							name="password"
							aria-invalid={$errors.password ? 'true' : undefined}
							bind:value={$form.password}
						/>
						{#if $errors.password}
							<small class="invalid">{$errors.password}</small>
						{/if}
					</div>

					<div class="lg:m-2 w-full lg:p-2">
						<Label for="confirmPassword">Confirmar contraseña</Label>
						<Input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							aria-invalid={$errors.confirmPassword ? 'true' : undefined}
							bind:value={$form.confirmPassword}
						/>
						{#if $errors.confirmPassword}
							<small class="invalid">{$errors.confirmPassword}</small>
						{/if}
					</div>

					<div class="lg:m-2 w-full md:col-span-2">
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<Label for="role">Rol</Label>
								<Select.Root>
									<Select.Trigger class="w-full">
										<Select.Value placeholder="seleccione" />
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="jefe">Jefe</Select.Item>
										<Select.Item value="encargado">Encargado</Select.Item>
										<Select.Item value="programador">Programador</Select.Item>
										<Select.Item value="sysAdmin">Admin. Sistemas</Select.Item>
									</Select.Content>
									<Select.Input name="role" />
								</Select.Root>
								{#if $errors.role}
									<small class="invalid">{$errors.role}</small>
								{/if}
							</div>

							<div>
								<Label for="department">Departamento</Label>
								<Select.Root>
									<Select.Trigger class="w-full">
										<Select.Value placeholder="seleccione" />
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="rrhh">RRHH</Select.Item>
										<Select.Item value="administracion">Administración</Select.Item>
										<Select.Item value="informatica">Informática</Select.Item>
									</Select.Content>
									<Select.Input name="department" />
								</Select.Root>
								{#if $errors.department}
									<small class="invalid">{$errors.department}</small>
								{/if}
							</div>

							<div>
								<Label for="location">Ubicación</Label>
								<Input
									type="text"
									id="location"
									name="location"
									aria-invalid={$errors.location ? 'true' : undefined}
									bind:value={$form.location}
								/>
								{#if $errors.location}
									<small class="invalid">{$errors.location}</small>
								{/if}
							</div>
						</div>
					</div>

					<div class="w-full md:col-span-2 text-center">
						<Button class="mt-4 w-full" type="submit">Registrar</Button>
					</div>
				</form>
			</Card.Content>
		</Card.Root>
	</div>
</main>

<style>
	.invalid {
		color: red;
	}
</style>
