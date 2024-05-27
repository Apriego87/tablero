<script lang="ts">
	import '../app.pcss'
	import { page } from '$app/stores'
	import type { PageData } from './$types'
	import { enhance } from '$app/forms'
	import { Button } from '$lib/components/ui/button'

	export let data: PageData
</script>

<svelte:head>
	<title>{$page.data.title}</title>
	<meta name="robots" content="noindex nofollow" />
</svelte:head>

<header>
	<div class="flex h-[10vh] items-center justify-between bg-black p-5">
		<h1 class="text-2xl font-bold text-white">{$page.data.title}</h1>
		<div class="flex flex-row">
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
					<div class="flex flex-row items-center">
						<p class="text-white mx-5">{data.username}</p>
						<Button variant="outline" type="submit">Cerrar sesión</Button>
					</div>
				</form>
			{/if}
		</div>
	</div>
</header>

<slot />
