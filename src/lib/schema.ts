import { serial, varchar, timestamp, pgTable, boolean, text, pgEnum } from "drizzle-orm/pg-core";


export const roleEnum = pgEnum("role", ["jefe", "encargado", "programador", "sysAdmin"])

export const employee = pgTable('employees', {
    id: text("id").primaryKey(),
    name: varchar('name').notNull(),
    surname: varchar('surname').notNull(),
    username: varchar('username').notNull().unique(),
    password: varchar('password').notNull(),
    email: varchar('email').notNull().unique(),
    role: roleEnum('role').notNull(),
    department: varchar('department').notNull(),
    location: varchar('location').notNull(),
    pfp: varchar('pfp')
})

export const event = pgTable('events', {
    id: serial('id').primaryKey(),
    creatorID: varchar('creatorID').notNull().references(() => employee.id),
    title: varchar('title').notNull(),
    description: varchar('description'),
    start: timestamp('start').notNull(),
    end: timestamp('end').notNull(),
    participants: varchar('participants').array(),
    department: varchar('department')
})

export const note = pgTable('notes', {
    id: serial('id').primaryKey(),
    creatorID: text('creatorID').notNull().references(() => employee.id),
    title: varchar('title').notNull(),
    description: varchar('description'),
    category: varchar('category')
})

export const file = pgTable('files', {
    id: serial('id').primaryKey(),
    creatorID: varchar('creatorID').notNull().references(() => employee.id),
    name: varchar('name').notNull(),
    mime: varchar('mime').notNull(),
    url: varchar('url').notNull()
})

export const chat = pgTable('chats', {
    id: serial('id').primaryKey(),
    senderID: varchar('senderID').notNull().references(() => employee.id),
    receiverID: varchar('receiverID').notNull().references(() => employee.id),
    message: text('message').notNull(),
    timestamp: timestamp("timestamp", {
        withTimezone: true,
        mode: "date"
    }).notNull()
})

export const task = pgTable('tasks', {
    id: serial('id').primaryKey(),
    creatorID: varchar('creatorID').notNull().references(() => employee.id),
    description: varchar('description').notNull(),
    checked: boolean('checked').notNull().default(false)
})

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => employee.id),
    expiresAt: timestamp("expiresAt", {
        withTimezone: true,
        mode: "date"
    }).notNull()
})