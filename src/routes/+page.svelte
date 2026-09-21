<script lang="ts">
    import { redirect } from "@sveltejs/kit";
    import { onMount } from "svelte";
    let gameName = $state("")

    // type Game = Record<string, any>
    
    // let games = $state<Game[]>([]);

    // async function loadGames() {
    //     const response = await fetch("/API/games", {
    //         method: "POST",
    //         body: JSON.stringify({
    //             endpoint: `games`,
    //             query: 
    //                 `
    //                 fields *; 
    //                 where name = "Minecraft";
    //                 `
    //         })
    //     });
    //     games = await response.json();
    // }

    // onMount(() => loadGames());

    function searchGame() {
        window.location.href = `./search/${encodeURIComponent(gameName)}`;
    }

</script>

<!-- {#each games as game}
    <p>{game.name}</p>
{/each} -->

<!-- <div class="container-sm"> -->
    <!-- <form onsubmit={e => {
        e.preventDefault();
        searchGame();
    }} class="form-inline">
        <div class="form-group mb-2">
            <label for="gameInput">Search for a game!</label>
            <input bind:value={gameName} placeholder="Search for a game!" class="form-control" id="gameInput"/>
        </div>
        <button type="button" class="btn btn-primary">go</button>
    </form> -->
<!-- </div> -->

<form onsubmit={e => {
        e.preventDefault();
        searchGame();
    }} class="w-25 mx-auto mt-3">
    <p class="text-center">Search for a game!</p>
    <div class="input-group mb-3">
        <input bind:value={gameName} id="gameInput" type="text" class="form-control" placeholder="Game name">
        <button class="btn btn-primary" type="submit">Button</button>
    </div>
</form>