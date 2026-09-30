import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { userTable } from "$lib/server/db/schema.js";
import { and, DrizzleQueryError, eq } from "drizzle-orm";
import { failed, success } from "$lib/utils/response.js";
import jwt from 'jsonwebtoken';
import { env } from "$env/dynamic/private";
import type { APIResponse } from "$lib/utils/response.js";
import bcrypt from "bcrypt";

export async function POST({ request }){

    const req = await request.json();

    try {
        const dbCall = await db.select().from(userTable).where(and(eq(userTable.name, req.name), eq(userTable.password, req.password)));

        if(dbCall.length !== 0) {
            const token = jwt.sign({id: dbCall[0].id, name: dbCall[0].name}, env.JWT_KEY)

            const userData = {
                id: dbCall[0].id,
                name: dbCall[0].name
            }

            console.log("Loggin succesful")
            return success({userData, token}, "Loggin succesful", 200);
        } else {
            console.log("Wrong username or password")
            return failed("Wrong username or password", 401)
        }
    }
    catch(e) {
        console.log(e)
        return failed("Unknown error", 500)
    }
}