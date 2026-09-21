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

    async function getCover(gameID: number) {
        return await fetch("/API/games", {
            method: "POST",
            body: JSON.stringify({
                endpoint: "covers",
                query: 
                    `
                    fields *;
                    where game = ${gameID};
                    `
            })
        }).then(response => response.json()).then(data => {return data})
    }
</script>

{#await getGame()}
    <p>Loading game...</p>
{:then data} 
    {#if !data[0]}
        <h3 class="text-danger text-center">Could not find game named "{params.game}" :/</h3>
    {:else}
        <p>{data[0].name}</p>
    {/if}    
{/await}