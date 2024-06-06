<script lang="ts">
	import '../app.pcss'
	import { page, navigating } from '$app/stores'
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'
	import { Button } from '$lib/components/ui/button'
	import { HamburgerMenu, ArrowLeft } from 'svelte-radix'
	import * as Avatar from '$lib/components/ui/avatar'
	import * as Sheet from '$lib/components/ui/sheet'
	import * as Popover from '$lib/components/ui/popover/index.js'

	export let data: PageData

	let open = false
	$: if ($navigating) open = false
</script>

<svelte:head>
	<title>{$page.data.title}</title>
	<meta name="robots" content="noindex nofollow" />
</svelte:head>

<header class="bg-primary px-5">
	<div class="flex h-[12vh] w-full flex-row items-center justify-between">
		<h1 class="max-w-full text-2xl font-bold text-white md:max-w-[30vw]">
			{$page.data.title}
		</h1>
		<div class="lg:flex lg:mr-5">
			{#if data.logged}
				<Sheet.Root bind:open>
					<Sheet.Trigger>
						<button class="text-white focus:outline-none" aria-label="abrir menú">
							<HamburgerMenu class="size-6" />
						</button>
					</Sheet.Trigger>
					<Sheet.Content>
						<div class="flex h-full w-full flex-col justify-between">
							<div class="flex h-[80%] flex-col justify-evenly gap-8">
								{#if data.registerRoute}
									<Button variant="link" href="/register">Registrar</Button>
								{/if}
								<Button variant="link" href="/board">Anuncios</Button>
								<Button variant="link" href="/">Tareas</Button>
								<Button variant="link" href="/userArea">Área de Empleados</Button>
								<Button variant="link" href="/fileStorage">Archivos</Button>
								<Button variant="link" href="/calendar">Calendario</Button>
							</div>

							<Popover.Root>
								<Popover.Trigger class="flex w-full items-center justify-center">
									<div class="flex flex-row gap-4">
										<Avatar.Root class="size-8 border-2">
											<Avatar.Image src={data.pfp} />
											<Avatar.Fallback>FP</Avatar.Fallback>
										</Avatar.Root>
										<p>{data.username}</p>
									</div>
								</Popover.Trigger>
								<Popover.Content class="w-[80%]">
									<div class="flex w-full flex-col">
										<Button variant="link" href="/profile?id={data.userId}">Perfil</Button>
										<form method="POST" action="?/signout" class="w-full" use:enhance>
											<Button variant="link" class="w-full" type="submit">Cerrar sesión</Button>
										</form>
									</div>
								</Popover.Content>
							</Popover.Root>
						</div>
					</Sheet.Content>
				</Sheet.Root>
			{/if}
		</div>
	</div>
</header>

<slot />
