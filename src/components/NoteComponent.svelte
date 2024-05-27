<script lang="ts">
	interface Note {
		id: number
		creatorID: string
		creatorName: string
		title: string
		description?: string
		category?: string
	}

	export let note: Note
	import * as Card from '$lib/components/ui/card/index.js'
	import { Trash, Pencil1, Check } from 'svelte-radix'
	import type { PageData } from '../routes/$types'

	function categoryToColor(category: string) {
		const hashCode: number = category
			.split('')
			.reduce((acc, char) => char.charCodeAt(0) + (acc << 6) + (acc << 16) - acc, 0)
		let color: string = (hashCode & 0x00ffffff).toString(16).toUpperCase()
		color = '#' + '00000'.substring(0, 6 - color.length) + color

		let r = parseInt(color.substring(1, 3), 16)
		let g = parseInt(color.substring(3, 5), 16)
		let b = parseInt(color.substring(5, 7), 16)

		const brightnessFactor = 1.5
		r = Math.floor(r * brightnessFactor)
		g = Math.floor(g * brightnessFactor)
		b = Math.floor(b * brightnessFactor)

		color = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()

		return color
	}

	let isEditing = false

	function makeEditable(body: Note) {
		const cardTitle = document.getElementById('cardTitle') as HTMLElement
		const cardBody = document.getElementById('cardBody') as HTMLElement
		const button = document.getElementById('makeEditable') as HTMLButtonElement
		
		if (cardTitle && cardBody && button) {
			if (cardTitle.contentEditable === 'true' && cardBody.contentEditable === 'true') {
				isEditing = !isEditing
				// Save the data
				const updatedTitle = cardTitle.innerText
				const updatedContent = cardBody.innerText
				const form = document.createElement('form')
				form.method = 'POST'
				form.action = '?/edit'

				const idInput = document.createElement('input')
				idInput.type = 'hidden'
				idInput.name = 'id'
				idInput.value = body.id.toString()
				form.appendChild(idInput)

				const titleInput = document.createElement('input')
				titleInput.type = 'hidden'
				titleInput.name = 'title'
				titleInput.value = updatedTitle
				form.appendChild(titleInput)

				const descriptionInput = document.createElement('input')
				descriptionInput.type = 'hidden'
				descriptionInput.name = 'description'
				descriptionInput.value = updatedContent
				form.appendChild(descriptionInput)

				document.body.appendChild(form)
				form.submit()

				// Cleanup
				document.body.removeChild(form)

				// Reset contentEditable and button text
				cardTitle.contentEditable = 'false'
				cardBody.contentEditable = 'false'
			} else {
				// Make content editable
				cardTitle.contentEditable = 'true'
				cardBody.contentEditable = 'true'
				isEditing = !isEditing
			}
		}
	}

	export let data: PageData

	var bgColor: string = categoryToColor(note.category ?? '')
</script>

<Card.Root class="card text-center" style="background-color: {bgColor}">
	<Card.Header>
		<Card.Title>
			<p id="cardTitle" class="text-xl font-bold">{note.title}</p>
		</Card.Title>
	</Card.Header>
	<Card.Content>
		<p id="cardBody">{note.description}</p>
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full flex-row justify-between">
			<small><p>De: <i>{note.creatorName}</i></p></small>
			{#if note.creatorID === data.userID}
				<form action="?/delete" method="post">
					<input type="hidden" name="noteID" value={note.id} />
					<button type="submit">
						<Trash class="h-4" />
					</button>
				</form>
				<button id="makeEditable" on:click={() => makeEditable(note)}>
					{#if isEditing}
						<Check class="h-4" />
					{:else}
						<Pencil1 class="h-4" />
					{/if}
				</button>
			{/if}
		</div>
	</Card.Footer>
</Card.Root>
