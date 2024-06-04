<script lang="ts">
	import type { PageData } from './$types'
	import * as Avatar from '$lib/components/ui/avatar/index.js'
	import * as HoverCard from '$lib/components/ui/hover-card/index.js'
	import { SewingPinFilled, Trash, Pencil1 } from 'svelte-radix'
	import { Badge } from '$lib/components/ui/badge'
	import { createSearchStore, searchHandler } from '$lib/stores/search'
	import { onDestroy } from 'svelte'

	import * as Card from '$lib/components/ui/card/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Select from '$lib/components/ui/select'
	import { Button } from '$lib/components/ui/button'
	import { Label } from '$lib/components/ui/label'
	import { fade } from 'svelte/transition'

	export let data: PageData

	interface User {
		id: string
		name: string
		surname: string
		username: string
		email: string
		department: string
		location: string
		role: string
		pfp?: string
	}

	let userData: User
	let openDialog = false

	const usersFormatted = data.users.map(({ password, ...user }) => user);

	const searchUsers = usersFormatted.map((user) => ({
		...user,
		searchTerms: `${user.name} ${user.email} ${user.role} ${user.location}`
	}))

	const searchStore = createSearchStore(searchUsers)

	const unsubscribe = searchStore.subscribe((model) => searchHandler(model))

	onDestroy(() => {
		unsubscribe()
	})

	function addParams(param: string) {
		if (!$searchStore.additionalSearchTerms.includes(param)) {
			$searchStore.additionalSearchTerms = [...$searchStore.additionalSearchTerms, param]
		}
	}

	function removeSearchTerm(term: string) {
		searchStore.update((store) => ({
			...store,
			additionalSearchTerms: store.additionalSearchTerms.filter((t) => t !== term)
		}))
	}

	function deleteUser(userId: string) {
		const form = document.createElement('form')
		form.method = 'POST'
		form.action = '?/delete' // Specify your form action URL

		const idInput = document.createElement('input')
		idInput.type = 'hidden'
		idInput.name = 'userId'
		idInput.value = userId

		form.appendChild(idInput)
		document.body.appendChild(form)
		form.submit()

		document.body.removeChild(form)
	}

	function editData(user: User) {
		userData = user

		setTimeout(() => {
			openDialog = true
		}, 500)
	}
</script>

<div id="cont" class="flex h-[88vh] w-full flex-col items-center justify-evenly">
	<Dialog.Root open={openDialog} onOutsideClick={(openDialog = false)}>
		<Dialog.Content class="flex w-full sm:w-3/4 lg:w-1/2 flex-col items-center justify-center">
			<form method="POST" action="?/update" class="w-full">
				<input type="hidden" name="userid" value={userData.id} />
				<div class="flex flex-col md:flex-row">
					<div class="m-2 w-full md:w-1/2">
						<Label for="name">Nombre</Label>
						<Input type="text" id="name" name="name" value={userData.name} />
					</div>

					<div class="m-2 w-full md:w-1/2">
						<Label for="surname">Apellidos</Label>
						<Input type="text" id="surname" name="surname" value={userData.surname} />
					</div>
				</div>

				<div class="flex flex-col md:flex-row">
					<div class="m-2 w-full md:w-1/2">
						<Label for="username">Usuario</Label>
						<Input type="text" id="username" name="username" value={userData.username} />
					</div>

					<div class="m-2 w-full md:w-1/2">
						<Label for="email">E-Mail</Label>
						<Input type="email" id="email" name="email" value={userData.email} />
					</div>
				</div>

				<div class="flex flex-col md:flex-row">
					<div class="m-2 w-full md:w-1/3">
						<Label for="role">Rol</Label>
						<Select.Root selected={{ value: userData.role }}>
							<Select.Trigger class="w-full">
								<Select.Value placeholder={userData.role} />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="jefe">Jefe</Select.Item>
								<Select.Item value="encargado">Encargado</Select.Item>
								<Select.Item value="programador">Programador</Select.Item>
								<Select.Item value="sysAdmin">Admin. Sistemas</Select.Item>
							</Select.Content>
							<Select.Input name="role" />
						</Select.Root>
					</div>

					<div class="m-2 w-full md:w-1/3">
						<Label for="department">Departamento</Label>
						<Select.Root selected={{ value: userData.department }}>
							<Select.Trigger class="w-full">
								<Select.Value placeholder={userData.department} />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="rrhh">RRHH</Select.Item>
								<Select.Item value="administracion">Administración</Select.Item>
								<Select.Item value="informatica">Informática</Select.Item>
							</Select.Content>
							<Select.Input name="department" />
						</Select.Root>
					</div>

					<div class="m-2 w-full md:w-1/3">
						<Label for="location">Ubicación</Label>
						<Input type="text" id="location" name="location" value={userData.location} />
					</div>
				</div>

				<div class="w-full text-center">
					<Button class="mt-4 w-full" type="submit">Guardar</Button>
				</div>
			</form>
		</Dialog.Content>
	</Dialog.Root>
	<Card.Root class="w-full sm:w-3/4 lg:w-1/2 max-w-[90vw]">
		<Card.Header>
			<Card.Title>Buscador de Empleados</Card.Title>
			<Card.Description>Puedes buscar por nombre, e-mail, ubicación o rol.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Input type="search" placeholder="Buscar..." bind:value={$searchStore.search} />
			{#if $searchStore.additionalSearchTerms.length != 0}
				<div id="terms" class="mt-4 flex w-full flex-row justify-center">
					{#each $searchStore.additionalSearchTerms as term (term)}
						<Badge class="mr-2"
							><button on:click={() => removeSearchTerm(term)}>{term}</button></Badge
						>
					{/each}
				</div>
			{/if}
		</Card.Content>
		{#if $searchStore.search != '' || $searchStore.additionalSearchTerms.length != 0}
			<Card.Footer>
				<div
					transition:fade
					class="flex max-h-[50vh] flex-row flex-wrap justify-between overflow-auto px-3"
				>
					{#each $searchStore.filtered as user}
						<HoverCard.Root>
							<div class="m-4 ml-0">
								<HoverCard.Trigger
									class="rounded-sm border border-gray-500 p-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
									>{user.name}
									{user.surname}
								</HoverCard.Trigger>
							</div>
							<HoverCard.Content class="w-80">
								<div class="flex justify-around space-x-4">
									<Avatar.Root>
										<Avatar.Image src={user.pfp} />
										<Avatar.Fallback>FP</Avatar.Fallback>
									</Avatar.Root>
									<div class="space-y-1">
										<div class="flex flex-row">
											<h4 class="text-sm font-semibold">{user.name}</h4>
											{#if data.manager}
												<button on:click={() => deleteUser(user.id)}>
													<Trash class="ml-4 h-4" />
												</button>
												<button on:click={() => editData(user)}>
													<Pencil1 class="ml-4 h-4" /></button
												>
											{/if}
										</div>
										<p class="text-sm">{user.email}</p>
										<div class="flex items-center pt-2">
											<SewingPinFilled class="mr-2 h-4 w-4 opacity-70" />{' '}
											<span class="text-xs text-muted-foreground"
												><button
													on:click={() => {
														addParams(user.location)
													}}>{user.location}</button
												></span
											>
										</div>
										<div class="flex items-center pt-2">
											<Badge
												><button
													on:click={() => {
														addParams(user.role)
													}}>{user.role}</button
												></Badge
											>
										</div>
									</div>
								</div>
							</HoverCard.Content>
						</HoverCard.Root>
					{/each}
				</div>
			</Card.Footer>
		{/if}
	</Card.Root>
</div>
