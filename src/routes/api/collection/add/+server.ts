import { auth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { collectionTable } from "$lib/server/db/schema";
import { success, failed } from "$lib/utils/response.js";
import { DrizzleQueryError, eq, and } from "drizzle-orm";

export async function POST({ request }) {
    const data = await request.json()

    const session = await auth.api.getSession({
        headers: request.headers
    })

    if(!session) {
        return(failed("No session", 401))
    }

    const dbCheck = await db.select().from(collectionTable).where(and(eq(collectionTable.gameId, data.gameId), eq(collectionTable.userId, session.user.id)))

    if(dbCheck.length > 0) {
        return(failed("Game Already in Collection", 409))
    }
    
    try {
        const dbInsert = await db.insert(collectionTable).values({gameId: data.gameId, userId: session.user.id}).returning()

        return(success(dbInsert, "Game added to collection", 200))
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