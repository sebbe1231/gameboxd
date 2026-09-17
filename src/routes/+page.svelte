<script lang="ts">
    import { redirect } from "@sveltejs/kit";
    import { onMount } from "svelte";
    let gameName = $state()

    type Game = Record<string, any>

    let games = $state<Game[]>([]);

    async function loadGames() {
        const response = await fetch("/API/games", {
            method: "POST",
            body: JSON.stringify({
                endpoint: `games`,
                query: `
                    fields *; 
                    where name = "Minecraft";
                    `
            })
        });
        games = await response.json();
    }

    onMount(() => loadGames());

    function searchGame() {
        window.location.href = `./${gameName}`
    }

</script>



<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#each games as game}
    <p>{game.name}</p>
{/each}

<input id="gamesearch" placeholder="Search for a game!"/>

<form onsubmit={e => {
    e.preventDefault();
    searchGame();
}}>
    <input bind:value={gameName} />
    <button>go</button>
</form>

<button type="button" class="btn btn-primary">Base class</button>
