<script lang="ts">
	// import Button from '$lib/components/ui/button/button.svelte'
	import { Plus } from 'svelte-radix'

	import { Button } from '$lib/components/ui/button'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import * as Select from '$lib/components/ui/select'
	import { Textarea } from '$lib/components/ui/textarea'

	import NoteComponent from '../../components/NoteComponent.svelte'
	import type { PageData } from '../$types'

	export let data: PageData

	console.log(data)
</script>

<!-- npm install -g dotenv-cli -->

<div>
	<Dialog.Root>
		<Dialog.Trigger>
			<div class="absolute bottom-5 right-5">
				<Button variant="default" class="size-16 rounded-full">
					<Plus class="size-4" />
				</Button>
			</div></Dialog.Trigger
		>
		<Dialog.Content class="w-[80%]">
			<Dialog.Header>
				<Dialog.Title>
					<p>Añade un anuncio</p>
				</Dialog.Title>
				<Dialog.Description>
					<p>Crea un aviso, recordatorio, o simplemente deja un mensaje bonito :)</p>
				</Dialog.Description>
			</Dialog.Header>
			<form method="POST" action="?/create">
				<div class="grid gap-4 py-4">
					<div class="grid grid-cols-1 gap-4">
						<Label for="title">Título</Label>
						<Input id="title" name="title" />
					</div>
					<div class="grid grid-cols-1 gap-4">
						<Label for="description">Descripción</Label>
						<Textarea id="description" name="description" />
					</div>
					<div class="grid grid-cols-1 gap-4">
						<Label for="category">Categoría</Label>
						<Select.Root>
							<Select.Trigger class="w-full">
								<Select.Value placeholder="categoría" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="informatica">Informática</Select.Item>
								<Select.Item value="rrhh">RRHH</Select.Item>
								<Select.Item value="general">General</Select.Item>
							</Select.Content>
							<Select.Input name="category" />
						</Select.Root>
					</div>
				</div>

				<Dialog.Footer>
					<Button type="submit" class="w-full">Guardar</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>

<div class="h-full w-full p-5">
	<h1 class="my-5 text-center text-3xl font-bold">Anuncios actuales</h1>
	<div class="flex flex-row flex-wrap justify-start">
		{#if data.notes.length === 0}
			<div class="mt-5 w-full text-center">
				<p><i>No hay anuncios que mostrar...</i></p>
			</div>
		{:else}
			{#each data.notes as note (note)}
				<div class="m-5 w-1/5">
					<NoteComponent {note} {data} />
				</div>
			{/each}
		{/if}
	</div>
</div>
