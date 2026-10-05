// Get all collection for specific game

import { auth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { collectionTable } from "$lib/server/db/schema";
import { success, failed } from "$lib/utils/response.js";
import {  and, DrizzleQueryError, eq } from "drizzle-orm";

type CollectionData = {
    userId: string | null;
    gameId: number | null;
}

export async function POST({ request }) {
    const data: CollectionData = await request.json()

    const session = await auth.api.getSession({
        headers: request.headers
    })

    if(!session) {
        return(failed("No session", 401))
    }    
    
    try {
        const collection = await db.select().from(collectionTable).where(and(
            data.userId ? eq(collectionTable.userId, data.userId): undefined,
            data.gameId ? eq(collectionTable.gameId, data.gameId): undefined
        ))

        return(success(collection, "Query succesful", 200))
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