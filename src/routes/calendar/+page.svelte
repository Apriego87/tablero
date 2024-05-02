<script lang="ts">
	import Calendar from '@event-calendar/core'
	import TimeGrid from '@event-calendar/time-grid'
	import DayGrid from '@event-calendar/day-grid'

	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Textarea } from '$lib/components/ui/textarea'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Select from '$lib/components/ui/select'
	import { Calendar as UICalendar } from '$lib/components/ui/calendar/index.js'
	import * as Popover from '$lib/components/ui/popover/index.js'
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date'
	import { Calendar as CalendarIcon } from 'svelte-radix'

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	})

	let inicio: DateValue | undefined = undefined
	let fin: DateValue | undefined = undefined

	export let data

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

	let eventos = []

	data.events.forEach(function (item) {
		eventos.push({
			id: item.id,
			allDay: false,
			start: item.start,
			end: item.end,
			title: item.title,
			backgroundColor: departmentToColor(item.department),
			extendedProps: { department: item.department }
		})
	})

	let plugins = [TimeGrid, DayGrid]
	let options = {
		view: 'timeGridDay',
		events: eventos
	}
</script>

<Dialog.Root>
	<div class="mt-5 w-full text-center">
		<Dialog.Trigger>
			<Button>Crear Evento</Button>
		</Dialog.Trigger>
	</div>
	<Dialog.Content class="flex h-[50vh] flex-col items-center justify-center">
		<Dialog.Header>
			<Dialog.Title class="text-center">Introduce los datos del evento:</Dialog.Title>
			<Dialog.Description>
				<form action="?/create" method="post" class="mt-2 flex flex-col">
					<div class="my-3 grid grid-cols-4 items-center gap-4">
						<Label for="title" class="text-right">Título</Label>
						<Input id="title" name="title" class="col-span-3" />
					</div>
					<div class="my-3 grid grid-cols-4 items-center gap-4">
						<Label for="description" class="text-right">Descripción</Label>
						<Textarea id="description" name="description" class="col-span-3" />
					</div>

					<div class="my-3 grid grid-cols-4 items-center gap-4">
						<Label for="department" class="text-right">Departamento</Label>
						<Select.Root>
							<Select.Trigger class="w-[200px]">
								<Select.Value placeholder="departamento" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="informatica">Informática</Select.Item>
								<Select.Item value="rrhh">RRHH</Select.Item>
								<Select.Item value="administracion">Administración</Select.Item>
							</Select.Content>
							<Select.Input name="department" />
						</Select.Root>
					</div>

					<!-- faltan las horas -->

					<div class="my-3 flex flex-row justify-center gap-4">
						<div>
							<Label for="start">Inicio:</Label>
							<Input type="datetime-local" id="start" name="start" />
						</div>
						<div>
							<Label for="end">Fin:</Label>
							<Input type="datetime-local" id="end" name="end" />
						</div>
					</div>

					<!-- <input hidden value={inicio} name="inicio" />
					<input hidden value={fin} name="fin" /> -->
					<div class="mt-2 w-full text-center">
						<Button type="submit">Enviar</Button>
					</div>
				</form>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<div id="cont" class="absolute top-36 flex h-[80vh] w-screen flex-row items-center justify-center">
	<div class="h-full w-[90vw] overflow-auto">
		<Calendar {plugins} {options} />
	</div>
</div>