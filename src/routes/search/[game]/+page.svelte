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
    import { goto } from "$app/navigation";
    let { params } = $props()

    import missing_thumbnail from "$lib/assets/missing_thumbnail.png";

    let gameName = $state("")


    function searchGame() {
        goto(`/search/${encodeURIComponent(gameName)}`)
    }

    async function getGame() {
        return await fetch("/API/IGDB", {
            method: "POST",
            body: JSON.stringify({
                endpoint: "games",
                query: 
                    `
                    fields name, first_release_date ,cover.image_id;
                    limit 20; 
                    search "${params.game}";
                    `
            })
        }).then(response => response.json()).then(data => {return data});
    }
</script>

<div class="container text-center">
    <div class="w-25 mx-auto mt-3">
        <form onsubmit={e => {
                e.preventDefault();
                searchGame();
            }}>
            <p class="text-center">Search for a game!</p>
            <div class="input-group mb-3">
                <input bind:value={gameName} id="gameInput" type="text" class="form-control" placeholder="Game name">
                <button class="btn btn-primary" type="submit">Button</button>
            </div>
        </form>
    </div>

{#await getGame()}
    <p>Loading...</p>
{:then data} 
    {#if data[0]}
        {#each data as game}
            <div class="d-flex justify-content-center mb-2" >
                <div class="d-flex position-relative justify-content-start align-items-center bg-body-secondary border border-2 rounded w-50 h-25">
                    {#if game.cover}
                        <img src="https://images.igdb.com/igdb/image/upload/t_thumb/{game.cover.image_id}.webp" class="rounded-start border-end border-2 object-fit-scale" style="height:3em" alt="..." >
                    {:else}
                        <img src={missing_thumbnail} class="rounded-start border-end border-2 object-fit-scale" style="height:3em" alt="..." >
                    {/if}
                    
                    <div class="ps-2">
                        <a href="/game/{game.id}" class="stretched-link text-dark " style="text-decoration: none;">{game.name}</a>
                    </div>
                    <div class="ms-auto px-2">
                        <div class="px-2 py-1 rounded-pill border border-2 border-light bg-light">
                            {new Date(game.first_release_date * 1000).getFullYear()}
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    {:else}
        <p>No game found</p>
    {/if}
{/await}
</div>