<script lang="ts">
	import { Label } from '$lib/components/ui/label'
	import { Input } from '$lib/components/ui/input'
	import * as Select from '$lib/components/ui/select'
	import { Button } from '$lib/components/ui/button'
	import * as Avatar from '$lib/components/ui/avatar/index.js'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Card from '$lib/components/ui/card'

	export let data

	const userData = data.user[0]

	const disabled = !['jefe', 'sysAdmin'].includes(userData.role)
</script>

<div id="cont" class="flex h-[88vh] w-full flex-col items-center justify-center">
	<div class="flex h-[85%] w-[90%] flex-row items-center gap-10 lg:w-[65%]">
		<Card.Root
			class="flex h-full w-full flex-col items-center pb-5 lg:h-fit lg:flex-row lg:items-start lg:pb-0"
		>
			<Card.Header class="flex w-2/5 flex-col items-center lg:h-full">
				<div class="flex h-fit w-full flex-col items-center lg:m-5">
					<Dialog.Root>
						<Dialog.Trigger>
							<Avatar.Root
								class="size-32 rounded-full opacity-80 hover:opacity-100 hover:shadow-lg lg:size-64"
							>
								<Avatar.Image src={userData.pfp} />
								<Avatar.Fallback>FP</Avatar.Fallback>
							</Avatar.Root>
						</Dialog.Trigger>
						<Dialog.Content class="w-[90%] lg:w-1/3">
							<form action="?/pfp" method="POST" enctype="multipart/form-data">
								<div class="m-2">
									<Label for="pfpEdit">Sube una imagen aquí:</Label>
									<Input type="file" name="pfpEdit" id="pfpEdit" class="my-4" />
								</div>
								<div class="m-2 w-full">
									<Button type="submit" class="w-full">Enviar</Button>
								</div>
							</form>
						</Dialog.Content>
					</Dialog.Root>
				</div>
			</Card.Header>
			<Card.Content class="h-full w-full overflow-auto lg:h-fit lg:w-3/5">
				<div class="h-full lg:m-5 lg:h-fit">
					<form
						method="POST"
						action="?/data"
						class="flex w-full flex-col justify-evenly overflow-auto"
					>
						<input type="hidden" name="userid" value={userData.id} />
						<div class="flex w-full flex-col">
							<div class="m-1">
								<Label for="name">Nombre</Label>
								<Input type="text" id="name" name="name" value={userData.name} />
							</div>

							<div class="m-1">
								<Label for="surname">Apellidos</Label>
								<Input type="text" id="surname" name="surname" value={userData.surname} />
							</div>

							<div class="m-1">
								<Label for="username">Usuario</Label>
								<Input type="text" id="username" name="username" value={userData.username} />
							</div>

							<div class="m-1">
								<Label for="email">E-Mail</Label>
								<Input type="email" id="email" name="email" value={userData.email} {disabled} />
							</div>

							<div class="m-1">
								<Label for="role">Rol</Label>
								<Select.Root selected={{ value: userData.role }} {disabled}>
									<Select.Trigger class="w-full">
										<Select.Value placeholder={userData.role} />
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="jefe">Jefe</Select.Item>
										<Select.Item value="encargado">Encargado</Select.Item>
										<Select.Item value="programador">Programador</Select.Item>
										<Select.Item value="sysAdmin">Admin. Sistemas</Select.Item>
									</Select.Content>
									<Select.Input name="role" />
								</Select.Root>
							</div>

							<div class="m-1">
								<Label for="department">Departamento</Label>
								<Select.Root selected={{ value: userData.department }} {disabled}>
									<Select.Trigger class="w-full">
										<Select.Value placeholder={userData.department} />
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="rrhh">RRHH</Select.Item>
										<Select.Item value="administracion">Administración</Select.Item>
										<Select.Item value="informatica">Informática</Select.Item>
									</Select.Content>
									<Select.Input name="department" />
								</Select.Root>
							</div>

							<div class="m-1">
								<Label for="location">Ubicación</Label>
								<Input
									type="text"
									id="location"
									name="location"
									value={userData.location}
									{disabled}
								/>
							</div>
						</div>

						<div class="w-full text-center">
							<Button class="mt-4 w-full" type="submit">Guardar</Button>
						</div>
					</form>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
