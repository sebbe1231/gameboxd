<script lang="ts">
    import { page } from '$app/state';
    import { decodeTag, tag_types } from '$lib/helpers.js';
    import missing_thumbnail from "$lib/assets/missing_thumbnail.png";

    const urlName = page.url.searchParams.get("name");
    const urlTags = page.url.searchParams.getAll("tag");
    let decodedTags: { type: number, id: number }[] = [];

    let searchInput = $state("")

    async function getTags() {
        let finalTags = [];

        for(const tag of urlTags) {
            const decoded = decodeTag(Number(tag))
            const resp = await fetch("/api/IGDB", {
                method: "POST",
                body: JSON.stringify({
                    endpoint: tag_types[decoded.type],
                    query: 
                        `
                        fields *;
                        where id = ${decoded.id};
                        `
                })
            })

            let response = await resp.json()

            finalTags.push(response[0])
        }

        return finalTags;
    }

    async function getGame() {
        const resp = await fetch("/api/IGDB", {
            method: "POST",
            body: JSON.stringify({
                endpoint: "games",
                query: 
                    `
                    fields name, first_release_date ,cover.image_id;
                    limit 20; 
                    ${urlName ? "search \"" + urlName + "\";" : ""}
                    ${urlTags.length > 0 ? "where tags = (" + urlTags + ");" : ""}
                    `
            })
        })

        return resp.json()
    }

    function searchGame() {
        let searchParams = page.url.searchParams
        searchParams.delete("name")
        searchParams.append("name", searchInput)

        location.href = `/search?${searchParams}`
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
                <input bind:value={searchInput} id="gameInput" type="text" class="form-control" placeholder="Game name">
                <button class="btn btn-primary" type="submit">Button</button>
            </div>
        </form>
    </div>

    <p class="fs-5 fst-italic fw-bold">{page.url.searchParams.get("name")}</p>

    <div class="d-flex justify-content-center mb-2">
        <div style="width:30em" class="border">
        <h6 class="text-decoration-underline">Tags</h6>
        <button type="button" class="btn btn-primary">Add Tags</button>
        <!-- TODO make it so you can add more tags -->
        <!-- TODO add sorting -->
        {#if urlTags.length > 0}
            {#await getTags()}
                <p>Loading...</p>
            {:then tags} 
                {#each tags as tag}
                    <p>{tag.name}</p>
                {/each}
            {/await}
        {/if}
        </div>
    </div>

{#await getGame()}
    <p>Loading...</p>
{:then data} 
    {#if data[0]}
        {#each data as game}
            <div class="d-flex justify-content-center mb-2" >
                <div class="d-flex position-relative justify-content-start align-items-center bg-body-secondary border border-2 rounded h-25" style="width:50em">
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