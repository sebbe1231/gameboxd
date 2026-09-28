import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { userTable } from "$lib/server/db/schema.js";
import { DrizzleQueryError } from "drizzle-orm";
import { failed, success } from "$lib/utils/response.js";
import jwt from 'jsonwebtoken';
import { env } from "$env/dynamic/private";
import type { APIResponse } from "$lib/utils/response.js";

export async function POST({ request }){

    const req = await request.json()

    try {
        const dbCall = await db.insert(userTable).values({
            name: req.name,
            password: req.password
        }).returning();

        const token = jwt.sign({id: dbCall[0].id, name: dbCall[0].name}, env.JWT_KEY);

        const userData = {
            id: dbCall[0].id,
            name: dbCall[0].name
        }

        console.log(token);
        console.log(dbCall);
        return success({userData, token}, "User created", 200);
    }
    catch(e: any) {
        if(e instanceof DrizzleQueryError && (e.cause as { code?: string }).code === "23505") {
            console.log("user already exsists")
            return failed("User already exsists", 409);
        }
        else {
            return failed("Unknown error" + e, 500);
        }
    }
}