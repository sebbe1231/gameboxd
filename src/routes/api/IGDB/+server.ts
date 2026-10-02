import { json } from "@sveltejs/kit";
import { igdb } from "$lib/server/igdb";

export async function POST({ request }) {

    const data = await request.json()
    const response = await igdb(
        data.endpoint,
        data.query
    );

    return json(response);
}