import { IGDB_CLIENT_ID } from "$env/static/private";
import { IGDB_CLIENT_SECRET } from "$env/static/private";

let accessToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
    if (accessToken && Date.now() < tokenExpiresAt) {
        return accessToken;
    }

    const response = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            client_id: IGDB_CLIENT_ID,
            client_secret: IGDB_CLIENT_SECRET,
            grant_type: "client_credentials"
        })
    });
    if(!response.ok) {
        throw new Error(`Failed to get Twitch token: ${response.status}`);
    }

    const data = await response.json();

    accessToken = data.access_token;

    tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000

    return accessToken;
}



export async function igdb<T>(endpoint: string, query: string): Promise<T> {
    const token = await getAccessToken();

    const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
        method: "POST",
        headers: {
            "Client-ID": IGDB_CLIENT_ID,
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain"
        },
        body: query
    });

    if(!response.ok) {
        const error = await response.text();

        throw new Error(`IGDB request failed: ${error} (${response.status})`)
    }

    return response.json()
}