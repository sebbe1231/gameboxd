<!-- <script lang="ts">
    let { params } = $props()
    import { onMount } from "svelte";
    let gameName = $state()

    type Game = Record<string, any>
    
    let games = $state<Game[]>([]);

    async function loadGames() {
        const response = await fetch("/API/games", {
            method: "POST",
            body: JSON.stringify({
                endpoint: `games`,
                query: 
                    `
                    fields *; 
                    where name = "Minecraft";
                    `
            })
        });
        games = await response.json();
    }

    onMount(() => loadGames());

</script>

<h1>HIIII</h1>
<p>{params.game}</p>
<p>{games[0]?.name}</p> -->
<!-- Above also works, but idk if i should use it, new code might be better -->

<script lang="ts">
    let { params } = $props()
    import { onMount } from "svelte";

    async function getGame() {
        return await fetch("/API/games", {
            method: "POST",
            body: JSON.stringify({
                endpoint: "games",
                query: 
                    `
                    fields *; 
                    search "${params.game}";
                    `
            })
        }).then(response => response.json()).then(data => {return data});
    }
</script>


{#await getGame()}
    <p>Loading...</p>
{:then data} 
    {#if data[0]}
        {#each data as game}
            <p><a href="/game/{encodeURIComponent(game.name)}">{game.name} ({new Date(game.first_release_date * 1000).getFullYear()})</a></p>
            {console.log(game)}
        {/each}
    {:else}
        <p>No game found</p>
    {/if}
{/await}