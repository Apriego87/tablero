<script lang="ts">
	export let note
	import * as Card from '$lib/components/ui/card/index.js'
	import { Trash } from 'svelte-radix'

	function categoryToColor(category) {
		const hashCode = category
			.split('')
			.reduce((acc, char) => char.charCodeAt(0) + (acc << 6) + (acc << 16) - acc, 0)
		const color = (hashCode & 0x00ffffff).toString(16).toUpperCase()
		return '#' + '00000'.substring(0, 6 - color.length) + color
	}

	export let data

	var bgColor = categoryToColor(note.category)
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
