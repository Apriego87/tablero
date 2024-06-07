<script lang="ts">
	import Calendar from '@event-calendar/core'
	import TimeGrid from '@event-calendar/time-grid'
	import DayGrid from '@event-calendar/day-grid'

	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Textarea } from '$lib/components/ui/textarea'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as ContextMenu from '$lib/components/ui/context-menu'
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js'
	import * as Select from '$lib/components/ui/select'
	import { Plus } from 'svelte-radix'

	let ec: Calendar

	export let data

	function departmentToColor(department: string) {
		const hashCode = department
			.split('')
			.reduce((acc, char) => char.charCodeAt(0) + (acc << 6) + (acc << 16) - acc, 0)
		const color = (hashCode & 0x00ffffff).toString(16).toUpperCase()
		return '#' + '00000'.substring(0, 6 - color.length) + color
	}

	interface EventItem {
		id: number
		allDay: boolean
		start: string
		end: string
		title: string
		backgroundColor: string
		extendedProps: { department: string; description: string }
	}

	let eventos: EventItem[] = []
	let openDialog = false
	let currentEvent: EventItem

	function formatDateToUTCString(date: Date): string {
		return new Date(date).toISOString().replace('T', ' ').substring(0, 19)
	}

	function deleteEvent(id) {
		if (confirm('¿Seguro que quieres borrar el evento?')) {
			ec.removeEventById(id)

			const formData = new URLSearchParams()
			formData.append('eventId', id)

			fetch('?/delete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData.toString()
			})
		}

		openDialog = false
	}

	data.events.forEach(function (item) {
		eventos.push({
			id: item.id,
			allDay: false,
			start: formatDateToUTCString(item.start),
			end: formatDateToUTCString(item.end),
			title: item.title,
			backgroundColor: departmentToColor(item.department || ''),
			extendedProps: { department: item.department || '', description: item.description || '' }
		})
	})

	let plugins = [TimeGrid, DayGrid]
	let options = {
		view: 'dayGridMonth',
		headerToolbar: {
			start: 'prev,next today, title',
			center: '',
			end: 'dayGridMonth, timeGridWeek, timeGridDay'
		},
		events: eventos,
		eventDurationEditable: true,
		eventClick: function ({ event }) {
			openDialog = true
			currentEvent = ec.getEventById(event.id)
		}
	}
</script>

<AlertDialog.Root open={openDialog} onOutsideClick={(openDialog = false)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{currentEvent.title}</AlertDialog.Title>
			<AlertDialog.Description>
				{currentEvent.extendedProps.description}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
			<AlertDialog.Action
				on:click={() => {
					deleteEvent(currentEvent.id)
				}}>Borrar</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root>
	<div class="mt-5 w-full text-center">
		<Dialog.Trigger>
			<Button>
				<Plus class="mr-2 h-4 w-4" />
				Crear Evento
			</Button>
		</Dialog.Trigger>
	</div>
	<Dialog.Content class="flex flex-col items-center justify-center">
		<Dialog.Header>
			<Dialog.Title class="text-center">Introduce los datos del evento:</Dialog.Title>
			<Dialog.Description>
				<form action="?/create" method="post" class="mt-2 flex w-full flex-col">
					<div class="my-3 flex flex-col gap-2">
						<Label for="title">Título</Label>
						<Input id="title" name="title" class="col-span-3" />
					</div>
					<div class="my-3 flex flex-col gap-2">
						<Label for="description">Descripción</Label>
						<Textarea id="description" name="description" class="col-span-3" />
					</div>

					<div class="my-3 flex w-full flex-col gap-2">
						<Label for="department">Departamento</Label>
						<Select.Root>
							<Select.Trigger class="w-full">
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

					<div class="my-3 flex flex-row justify-center gap-2">
						<div class="my-3">
							<Label for="start">Inicio</Label>
							<Input
								type="datetime-local"
								id="start"
								name="start"
								value={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
									.toISOString()
									.slice(0, 16)}
							/>
						</div>
						<div class="my-3">
							<Label for="end">Fin</Label>
							<Input
								type="datetime-local"
								id="end"
								name="end"
								value={new Date(
									new Date().getTime() + 60 * 60 * 1000 - new Date().getTimezoneOffset() * 60000
								)
									.toISOString()
									.slice(0, 16)}
							/>
						</div>
					</div>

					<div class="mt-2 w-full text-center">
						<Button class="w-full" type="submit">Enviar</Button>
					</div>
				</form>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<div id="cont" class="absolute top-36 flex h-[80vh] w-screen flex-row items-center justify-center">
	<div class="h-full w-[90vw] overflow-auto">
		<Calendar bind:this={ec} {plugins} {options} />
	</div>
</div>
