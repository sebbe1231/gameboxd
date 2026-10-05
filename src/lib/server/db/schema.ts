import { pgTable, timestamp, index, unique, serial, integer, text, varchar } from 'drizzle-orm/pg-core';
import { relations } from "drizzle-orm";
import { user } from './auth.schema';

// export const userTable = pgTable('users', {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar().notNull().unique(),
// 	password: varchar().notNull()
// });

export const collectionTable = pgTable("collection", 
    {   
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        gameId: integer().notNull(),
        userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
        createdAt: timestamp().defaultNow().notNull()
    }
)

export *  from './auth.schema';
