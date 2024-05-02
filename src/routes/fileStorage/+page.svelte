<script lang="ts">
	import { enhance } from '$app/forms'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import * as Card from '$lib/components/ui/card'

	import excel from '$lib/assets/excel.png'
	import image from '$lib/assets/image.png'
	import pdf from '$lib/assets/pdf.png'
	import unknown from '$lib/assets/unknown.png'

	const authorizedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.xlsx']

	const iconMapping = {
		'image/jpg': image,
		'image/jpeg': image,
		'image/png': image,
		'application/pdf': pdf,
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': excel
	}

	function getIconUrl(mimeType) {
		return iconMapping[mimeType] || unknown
	}

	export let data
</script>

<div id="cont" class="flex h-[90vh] w-full flex-col items-center justify-start">
	<div class="w-full p-5">
		<h1 class="my-5 text-center text-2xl font-bold">Tus archivos:</h1>

		<div class="flex flex-row flex-wrap justify-start">
			{#each data.files as file (file.id)}
				<div class="w-1/6">
					<a href={file.url} class="flex flex-col items-center justify-center px-5">
						<img src={getIconUrl(file.mime)} alt="xls" class="w-[64px]" />
						{file.name}
					</a>
				</div>
			{/each}
		</div>
	</div>
	<div class="absolute bottom-10 flex w-full flex-col items-center">
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
					<Input
						type="file"
						id="file"
						name="fileToUpload"
						class="text-center"
						required
					/>
				</Card.Content>
				<Card.Footer>
					<Button type="submit">Enviar</Button>
				</Card.Footer>
			</Card.Root>
		</form>
	</div>
</div>
