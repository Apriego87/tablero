<script lang="ts">
	import '../app.pcss'
	import { page } from '$app/stores'
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'
	import { Button } from '$lib/components/ui/button'
	import * as Avatar from '$lib/components/ui/avatar'
	import { Person } from 'svelte-radix'

	export let data: PageData
</script>

<svelte:head>
	<title>{$page.data.title}</title>
	<meta name="robots" content="noindex nofollow" />
</svelte:head>

<header>
	<div class="flex h-[12vh] w-full items-center justify-between bg-primary p-5">
		<h1 class="w-[30%] text-2xl font-bold text-white">{$page.data.title}</h1>
		<div class="flex w-[70%] flex-row items-center justify-end">
			{#if data.logged}
				<div class="mr-5 flex flex-row items-center">
					{#if data.registerRoute}
						<Button variant="link" class="text-white" href="/register">Registrar</Button>
					{/if}
					<Button variant="link" class="text-white" href="/board">Anuncios</Button>
					<Button variant="link" class="text-white" href="/">Tareas</Button>
					<Button variant="link" class="text-white" href="/userArea">Área de Empleados</Button>
					<Button variant="link" class="text-white" href="/fileStorage">Archivos</Button>
					<Button variant="link" class="text-white" href="/calendar">Calendario</Button>
				</div>
				<form method="POST" action="?/signout" use:enhance>
					<div class="flex flex-row items-center text-white">
						<div class="flex flex-row items-center">
							<Button variant="link" class="text-white" href="/profile?id={data.userId}">
								<Avatar.Root class="mx-2 size-8 border-2 border-white">
									<Avatar.Image src={data.pfp} />
									<Avatar.Fallback>FP</Avatar.Fallback>
								</Avatar.Root>
								<p class="mx-2">{data.username}</p></Button
							>
						</div>
						<Button class="text-black" variant="outline" type="submit">Cerrar sesión</Button>
					</div>
				</form>
			{/if}
		</div>
	</div>
</header>

<slot />
