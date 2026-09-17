import { json } from "@sveltejs/kit";
import { igdb } from "$lib/server/igdb";

export async function POST({ request }) {


    // Request body data structure
    // const response = await igdb(
    //     "games",
    //     `
    //     fields *;
    //     where name = "Minecraft";
    //     `
    // );

    const data = await request.json()
    console.log("HEJ")
    console.log(data)
    const response = await igdb(
        data.endpoint,
        data.query
    );

    return json(response);
}