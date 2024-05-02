<script lang="ts">
	export let note
	import * as Card from '$lib/components/ui/card/index.js'

	// console.log(note)

	function departmentToColor(department) {
		// Convert department to a unique number (e.g., hash code)
		const hashCode = department
			.split('')
			.reduce((acc, char) => char.charCodeAt(0) + (acc << 6) + (acc << 16) - acc, 0)
		// Convert the number to a hex color code
		const color = (hashCode & 0x00ffffff).toString(16).toUpperCase()
		// Add leading zeros if necessary
		return '#' + '00000'.substring(0, 6 - color.length) + color
	}

	var bgColor = departmentToColor(note.category)
	console.log(bgColor)
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
		<small><p>De: <i>{note.creatorName}</i></p></small>
	</Card.Footer>
</Card.Root>
