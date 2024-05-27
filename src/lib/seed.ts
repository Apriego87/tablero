import { db } from '$lib';
import { employee } from './schema';
import { faker } from "@faker-js/faker";
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

enum Role {
    Jefe = 'jefe',
    Encargado = 'encargado',
    Programador = 'programador'
}

enum Department {
    Administracion = 'administracion',
    RRHH = 'rrhh',
    Informatica = 'informatica'
}

enum Location {
    Barbastro = 'Barbastro',
    Huesca = 'Huesca',
    Monzon = 'Monzón',
}

const roles: Role[] = [Role.Jefe, Role.Encargado, Role.Programador]
const departments: Department[] = [Department.Administracion, Department.RRHH, Department.Informatica]
const locations: Location[] = [Location.Barbastro, Location.Huesca, Location.Monzon]

async function insertFakeUsers() {
    const hashedPassword = await new Argon2id().hash('rootroot')
    for (let i = 0; i < 98; i++) {
        await db.insert(employee).values({
            id: generateId(15),
            name: faker.person.firstName(),
            surname: faker.person.lastName(),
            username: faker.internet.userName().toLowerCase(),
            password: hashedPassword,
            email: faker.internet.email(),
            role: roles[Math.floor(Math.random() * roles.length)],
            department: departments[Math.floor(Math.random() * roles.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            pfp: faker.image.avatar()
        });
    }
}

insertFakeUsers().then(() => {
    console.log('Inserción terminada.');
    process.exit(0)
}).catch(error => {
    console.error('Error insertando usuarios de prueba:', error);
    process.exit(1)
});