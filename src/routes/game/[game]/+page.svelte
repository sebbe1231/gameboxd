<script lang="ts">
    let { params } = $props()
    import { onMount } from "svelte";

    async function getGame() {
        const resp = await fetch("/API/IGDB", {
            method: "POST",
            body: JSON.stringify({
                endpoint: "games",
                query: 
                    `
                    fields name, cover.image_id; 
                    where name = "${params.game}";
                    `
            })
        });

        return resp.json();
    }
</script>

{#await getGame()}
    <p>Loading game...</p>
{:then data} 
    {#if !data[0]}
        <h3 class="text-danger text-center">Could not find game named "{params.game}" :/</h3>
    {:else}
        <p>{data[0].name}</p>
        <img src="https://images.igdb.com/igdb/image/upload/t_cover_big/{data[0].cover.image_id}.webp" class="rounded float-start img-fluid" alt="Game Cover">
    {/if}    
{/await}