import { pgTable, serial, integer, text, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar().notNull(),
	password: varchar().notNull()
});
