<script lang="ts">
	import { enhance } from '$app/forms'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label/index.js'
	import * as Card from '$lib/components/ui/card'
	import * as ContextMenu from '$lib/components/ui/context-menu'
	import * as Dialog from '$lib/components/ui/dialog'

	import excel from '$lib/assets/excel.png'
	import image from '$lib/assets/image.png'
	import pdf from '$lib/assets/pdf.png'
	import unknown from '$lib/assets/unknown.png'
	import type { PageData } from '../$types'

	interface File {
		id: number,
		creatorID: string,
		name: string,
		mime: string,
		url: string
	}

	const iconMapping: { [key: string]: string } = {
		'image/jpg': image,
		'image/jpeg': image,
		'image/png': image,
		'application/pdf': pdf,
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': excel
	}

	let fileData: File
	let openDialog = false

	function getIconUrl(mimeType: string) {
		return iconMapping[mimeType] || unknown
	}

	function editFile(file: File) {
		fileData = file
		openDialog = true
	}

	export let data: PageData
</script>

<div id="cont" class="flex h-[88vh] w-full flex-col items-center justify-start">
	<Dialog.Root open={openDialog}>
		<Dialog.Content class="flex w-1/2 flex-col items-center justify-center">
			<form method="POST" action="?/update" class="w-full">
				<input type="hidden" name="id" value={fileData.id} />
				<div class="m-2">
					<Label for="name">Nombre</Label>
					<Input type="text" id="name" name="name" value={fileData.name} />
				</div>
				<div class="w-full text-center m-2">
					<Button type="submit">Guardar</Button>
				</div>
			</form>
		</Dialog.Content>
	</Dialog.Root>
	<div class="w-full p-5">
		<h1 class="my-5 text-center text-3xl font-bold">Tus archivos:</h1>

		<div class="flex flex-row flex-wrap justify-start">
			{#if data.files.length === 0}
				<div class="mt-5 w-full text-center">
					<p><i>No tienes archivos que mostrar...</i></p>
				</div>
			{:else}
				{#each data.files as file (file.id)}
					<form id="deleteForm{file.id}" action="?/delete" method="post">
						<input type="hidden" name="fileID" value={file.id} />
					</form>
					<ContextMenu.Root>
						<div class="w-1/6">
							<ContextMenu.Trigger>
								<a href={file.url} class="flex flex-col items-center justify-center px-5">
									<img src={getIconUrl(file.mime)} alt="xls" class="w-[64px]" />
									{file.name}
								</a></ContextMenu.Trigger
							>
						</div>
						<ContextMenu.Content>
							<ContextMenu.Item
								on:click={() => {
									editFile(file)
								}}><p>Editar</p></ContextMenu.Item
							>
							<ContextMenu.Item
								on:click={() => {
									document.getElementById(`deleteForm${file.id}`).submit()
								}}><p>Borrar</p></ContextMenu.Item
							>
						</ContextMenu.Content>
					</ContextMenu.Root>
				{/each}
			{/if}
		</div>
	</div>
	<div class="absolute bottom-20 flex w-full flex-col items-center">
		<form
			action="?/upload"
			method="post"
			use:enhance
			enctype="multipart/form-data"
			class="mt-5 w-1/3"
		>
			<Card.Root class="flex flex-col items-center justify-center">
				<Card.Header>
					<Card.Title><label for="file">Sube aquí tu archivo: </label></Card.Title>
				</Card.Header>
				<Card.Content class="flex-column flex w-full flex-wrap items-center justify-center">
					<Input type="file" id="file" name="fileToUpload" class="text-center" required />
				</Card.Content>
				<Card.Footer>
					<Button type="submit">Enviar</Button>
				</Card.Footer>
			</Card.Root>
		</form>
	</div>
</div>
