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
	import { Trash } from 'svelte-radix'
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

	export let data: PageData

	var bgColor: string = categoryToColor(note.category ?? '')
</script>

<!-- <div>
	<p>{note.title}</p>
	<p>{note.description}</p>
</div> -->

<Card.Root class="card text-center" style="background-color: {bgColor}">
	<Card.Header>
		<Card.Title class="text-xl font-bold">{note.title}</Card.Title>
	</Card.Header>
	<Card.Content>
		<p>{note.description}</p>
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
			{/if}
		</div>
	</Card.Footer>
</Card.Root>
