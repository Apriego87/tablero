<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Label } from '$lib/components/ui/label'
	import { Input } from '$lib/components/ui/input'
	import * as Card from '$lib/components/ui/card'
	import { Person, LockClosed } from 'svelte-radix'

	import { superForm } from 'sveltekit-superforms'
	import type { PageData } from '../$types'

	export let data: PageData

	const { form, errors, constraints, message, enhance } = superForm(data.form, {})
</script>

{#if $message}<h3>{$message}</h3>{/if}

<main class="h-[88vh] flex flex-col justify-center items-center">
	<div class="w-[500px] max-w-[90vw]">
		<Card.Root>
			<Card.Header>
				<Card.Title>
					<p class="text-2xl font-bold">Bienvenido de vuelta</p>
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<form method="POST" use:enhance class="w-full">
					<div class="flex flex-col items-center justify-center">
						<div class="m-2 w-full">
							<div class="flex flex-row items-center justify-center">
								<Person class="relative mx-5" />
								<Input
									type="text"
									id="username"
									name="username"
									placeholder="Usuario"
									class="mt-1"
									aria-invalid={$errors.username ? 'true' : undefined}
									bind:value={$form.username}
									{...$constraints.username}
									required
								/>
							</div>
							{#if $errors.username}
								<div class="w-full text-center">
									<span class="invalid">
										{$errors.username}
									</span>
								</div>
							{/if}
						</div>

						<div class="m-2 w-full">
							<div class="flex flex-row items-center justify-center">
								<Input
									type="password"
									id="password"
									name="password"
									placeholder="Contraseña"
									class="mt-1"
									aria-invalid={$errors.password ? 'true' : undefined}
									bind:value={$form.password}
									{...$constraints.password}
								/>
								<LockClosed class="relative mx-5" />
							</div>

							{#if $errors.password}
								<div class="w-full text-center">
									<span class="invalid">
										{$errors.password}
									</span>
								</div>
							{/if}
						</div>
					</div>

					<div class="w-full text-center">
						<Button class="mt-4 w-full" type="submit">Iniciar sesión</Button>
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
