// Get all collection for specific game

import { auth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { collectionTable } from "$lib/server/db/schema";
import { success, failed } from "$lib/utils/response.js";
import {  and, DrizzleQueryError, eq } from "drizzle-orm";

export async function POST({ request }) {
    const data = await request.json()

    const session = await auth.api.getSession({
        headers: request.headers
    })

    if(!session) {
        return(failed("No session", 401))
    }    
    
    try {
        const collection = await db.delete(collectionTable).where(and(eq(collectionTable.gameId, data.gameId), eq(collectionTable.userId, session.user.id)))

        return(success(collection, "Game Removed", 200))
    }
    catch(e: any) {
        if(e instanceof DrizzleQueryError && (e.cause as { code?: string }).code === "23502") {
            return(failed("Missing Data", 500))
        }
        else {
            return(failed("Unknown Error", 500))
        }
    }
}