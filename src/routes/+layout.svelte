<script lang="ts">
	import '../app.pcss'
	import { page } from '$app/stores'
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'
	import { Button } from '$lib/components/ui/button'
	import { Person } from 'svelte-radix'

	export let data: PageData
</script>

<svelte:head>
	<title>{$page.data.title}</title>
	<meta name="robots" content="noindex nofollow" />
</svelte:head>

<header>
	<div class="flex h-[12vh] w-full items-center justify-between bg-black p-5">
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
						<div class="mx-4 flex flex-row items-center">
							<Person class="h-4" />
							<Button variant="link" class="text-white" href="/profile?id={data.userId}"
								>{data.username}</Button
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
