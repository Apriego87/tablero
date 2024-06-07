<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox'
	import { Button } from '$lib/components/ui/button'
	import * as Accordion from '$lib/components/ui/accordion/index.js'
	import { Separator } from '$lib/components/ui/separator'
	import { Pencil1, Check } from 'svelte-radix'
	import { fade } from 'svelte/transition'
	import type { PageData } from '../routes/$types'

	export let data: PageData

	interface Task {
		taskID: string
		checked: boolean
		description: string
		status: boolean
	}

	const allTasks: Task[] = (data.allTasks ?? []) as unknown as Task[]

	function updateChecked(item: Task) {
		try {
			fetch('?/update', {
				method: 'POST',
				body: JSON.stringify(item)
			})
		} catch (error) {
			console.error('Error fetching data:', error)
			return {
				status: 500,
				error: 'Internal Server Error'
			}
		}
	}

	function updateDescription(item: Task, newDescription: string) {
		if (!newDescription.trim()) {
			alert('La descripción no puede estar vacía.')
			return
		}

		item.description = newDescription
		try {
			fetch('?/updateDesc', {
				method: 'POST',
				body: JSON.stringify(item)
			})
		} catch (error) {
			console.error('Error fetching data:', error)
			return {
				status: 500,
				error: 'Internal Server Error'
			}
		}
	}

	let isEditing = {}

	function makeEditable(taskID: string) {
		const cardBody = document.getElementById(`task-${taskID}`) as HTMLElement

		if (cardBody) {
			const isCurrentlyEditing = cardBody.contentEditable === 'true'
			isEditing[taskID] = !isCurrentlyEditing

			if (isCurrentlyEditing) {
				// Save the data
				const updatedContent = cardBody.innerText.trim()
				if (!updatedContent) {
					alert('La descripción no puede estar vacía.')
					return
				}
				const task = allTasks.find((task) => task.taskID === taskID)

				if (task) {
					updateDescription(task, updatedContent)
				}

				// Reset contentEditable
				cardBody.contentEditable = 'false'
			} else {
				// Make content editable
				cardBody.contentEditable = 'true'
				cardBody.focus()
			}
		}
	}
</script>

<div class="w-full">
	{#if data.status !== 404}
		<div class="mb-5 flex flex-col justify-center p-2">
			{#if allTasks.every((tarea) => tarea.checked)}
				<div>
					<p><i>No hay tareas por hacer!</i></p>
				</div>
			{:else}
				{#each allTasks as item}
					{#if !item.checked}
						<div transition:fade class="m-2 flex items-center space-x-2">
							<Checkbox
								bind:checked={item.checked}
								onCheckedChange={() => {
									updateChecked(item)
								}}
								id={item.taskID}
							/>
							<div class="flex items-center">
								<p
									id={`task-${item.taskID}`}
									class="description"
									contenteditable={isEditing[item.taskID] ? 'true' : 'false'}
									on:input={() => {}}
								>
									{item.description}
								</p>
								<button class="ml-2" on:click={() => makeEditable(item.taskID)}>
									{#if isEditing[item.taskID]}
										<Check class="h-4" />
									{:else}
										<Pencil1 class="h-4" />
									{/if}
								</button>
							</div>
						</div>
					{/if}
				{/each}
			{/if}
		</div>
		<Separator />
		<div class="flex flex-col justify-center p-2">
			<Accordion.Root class="w-full">
				<Accordion.Item value="item-1">
					<Accordion.Trigger>Tareas completadas</Accordion.Trigger>
					{#each allTasks as item (item)}
						{#if item.checked}
							<Accordion.Content>
								<div class="mx-2 flex items-center space-x-2">
									<Checkbox
										bind:checked={item.checked}
										onCheckedChange={() => {
											updateChecked(item)
										}}
										id={item.taskID}
									/>
									<div class="flex items-center">
										<p
											id={`task-${item.taskID}`}
											class="description"
											contenteditable={isEditing[item.taskID] ? 'true' : 'false'}
											on:input={() => {}}
										>
											{item.description}
										</p>
										<button class="ml-2" on:click={() => makeEditable(item.taskID)}>
											{#if isEditing[item.taskID]}
												<Check class="h-4" />
											{:else}
												<Pencil1 class="h-4" />
											{/if}
										</button>
									</div>
								</div>
							</Accordion.Content>
						{/if}
					{/each}

					{#if allTasks.some((tarea) => tarea.checked)}
						<Accordion.Content>
							<form method="POST" class="w-full" action="?/deleteChecked">
								<Button type="submit" class="w-full" id="delButton">Borrar completadas</Button>
							</form>
						</Accordion.Content>
					{:else}
						<Accordion.Content>
							<div>
								<p><i>Las tareas completadas aparecerán aquí</i></p>
							</div>
						</Accordion.Content>
					{/if}
				</Accordion.Item>
			</Accordion.Root>
		</div>
	{/if}
</div>

<style>
	.description[contenteditable='true'] {
		border: 1px solid #ccc;
		padding: 2px;
		border-radius: 4px;
	}
</style>
