<script lang="ts">
    import { page } from '$app/state';
    import { decodeTag, tag_types, sort_types } from '$lib/helpers.js';
    import missing_thumbnail from "$lib/assets/missing_thumbnail.png";
    import { SvelteURLSearchParams } from 'svelte/reactivity';
    import desc from "$lib/assets/sort-up.svg";
    import asc from "$lib/assets/sort-down.svg";

    const gamesPerPage = 20;

    let searchParams = new SvelteURLSearchParams(page.url.searchParams);
    let currentPage = $state(searchParams.get("page"))
    const urlName = searchParams.get("name");
    const urlTags = searchParams.getAll("tag");
    

    let decodedTags: { type: number, id: number }[] = [];
    
    let searchInput = $state("");

    // Adds tag to search params
    // If tag is already in searchParams, remove tag, so you can toggle add tags
    // Only used for the "add tag modal"
    async function addTag(id: any) {
        if(searchParams.has("tag", id)) {
            searchParams.delete("tag", id)
        } else {
            searchParams.append("tag", id)
        }
    }

    // Remove tag from search params, and then reload
    // It differes from addTag() by forcing a reload and is only used for the list of current tags
    async function removeTag(id: any) {
        searchParams.delete("tag", id)
        

        location.href = `/search/?${searchParams}`
    }

    // Gets all themes that IGDB has
    async function getAllThemes() {
        const resp = await fetch("/api/IGDB", {
            method: "POST",
            body: JSON.stringify({
                endpoint: "themes",
                query: 
                    `
                    fields *;
                    limit 100;
                    `
            })
        })

        return resp.json()
    }

    // Gets all genres that IGDB has
    async function getAllGenre() {
        const resp = await fetch("/api/IGDB", {
            method: "POST",
            body: JSON.stringify({
                endpoint: "genres",
                query: 
                    `
                    fields *;
                    limit 100;
                    `
            })
        })

        return resp.json()
    }

    // Get all tags in search params and decode them
    // "tag_type" is added to the json to have a reference 
    // Returns an array of all given tags, decoded
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
            response[0]["tag_type"] = decoded.type;

            finalTags.push(response[0])
        }

        return finalTags;
    }

    // Searches for games by paramaters given
    // It looks really messy, and i might clean it up later, its just a bunch of one line if statements to make it more compact
    // Its run on load of the page
    async function getGame() {
        let sort;
        let order;

        // Sets sort option to given type, if none, set to ascending
        if(searchParams.has("sort")) {
            sort = searchParams.get("sort");
            if(!searchParams.has("order")) {
                order = "asc"
            }
            else {
                order = searchParams.get("order")
            }
        }
        
        const resp = await fetch("/api/IGDB", {
            method: "POST",
            body: JSON.stringify({
                endpoint: "games",
                query: 
                    `
                    fields name, first_release_date ,cover.image_id;
                    limit ${gamesPerPage+1}; 
                    ${searchParams.has("page") ? "offset " + (Number(searchParams.get("page")) - 1) * 20  + ";" : ""}
                    ${urlName ? "search \"" + urlName + "\";" : ""}
                    ${urlTags.length > 0 ? "where tags = (" + urlTags + ");" : ""}
                    ${sort ? "sort " + sort + ":" + order + ";" : ""}
                    `
            })
        })

        if(!resp.ok) {
            throw new Error(`HTTP error! ${resp.status}`)
        }

        return resp.json()
    }


    // =========== TODO =============
    // Add error handling to all of it
    // Not only this page, but all of them, find an elegant way of doing so
    // ==============================





    // Switches pages
    async function switchPage(amount: number) {
        let currentPage  = 0;

        // If the function is called, but no page in search params is found, goes to the first page
        if(!searchParams.has("page")) {
            searchParams.set("page", "1");
        }

        try {
            currentPage = Number(searchParams.get("page"))
        }
        catch {
            return
        }

        searchParams.set("page", String(currentPage + amount))
        location.href = `/search?${searchParams}`
    }

    // Adds sorting option to search params and forces a reload
    async function addSort(sort: string) {
        searchParams.set("sort", sort);

        // Toggle between order 
        searchParams.set("order", searchParams.has("order", "asc") ? "desc" : "asc")
        location.href = `/search?${searchParams}`;
    }

    // Removes sorting option from search params and forces a reload
    async function removeSort() {
        searchParams.delete("sort");
        searchParams.delete("order");
        location.href = `/search?${searchParams}`
    }

    // Function to search for games with all paramaters
    // Deletes given name from search paramaters first, and after it applies new game name search
    // If no name is given, then dont set a "name" tag in search paramaters
    // Forces a reload
    function searchGame() {
        searchParams.delete("name")
        if(searchInput.length > 0) {
            searchParams.append("name", searchInput)
        }

        location.href = `/search?${searchParams}`
    }


    // ======== TODO ==========
    // All of this code is very messy, and NEEDS to be optimized, but i will get to that later
    // ========================
</script>


<div class="container text-center">

    <!-- The search input bar -->
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

    <h5 class="fst-italic">{searchParams.get("name")}</h5>


    <!-- DIV for all currently chosen tags -->
    <!-- Click tag to remove it -->
    <div class="d-flex justify-content-center mb-2">
        <div style="width:30em" class="border rounded">
        <h6 class="text-decoration-underline">Tags</h6>
            <div class="d-flex flex-wrap justify-content-center">
                {#if urlTags.length > 0}
                    {#await getTags()}
                        <p>Loading...</p>
                    {:then tags} 
                        {#each tags as tag}
                            <button class="btn btn-outline-secondary hover-remove-object m-1" onclick={() => removeTag((tag.tag_type << 28) | tag.id)}>{tag.name}</button>
                        {/each}
                    {/await}
                {/if}
            </div>
        <div class="my-2">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tagModal">Add Tags</button>
        </div>
        </div>
    </div>

{#await getGame()}
    <p>Loading...</p>
{:then data} 
    {#if data[0]}

        <!-- ========== Sort menu ========== -->
        <!-- The sort menu, it only displays if any games were found -->

        <div class="dropdown mb-2">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Sort
            </button>
            <ul class="dropdown-menu">
                <li><button class="dropdown-item btn {searchParams.has("sort", "name") ? "active" : ""}" 
                    onclick={() => addSort("name")}>
                    {#if searchParams.has("sort", "name")}
                        {#if searchParams.has("order", "asc") || !searchParams.has("order")}
                            <img src="{asc}" alt="...">
                        {:else}
                            <img src="{desc}" alt="...">
                        {/if}
                    {/if}
                    By Name</button>
                </li>
                <li><button class="dropdown-item btn {searchParams.has("sort", "first_release_date") ? "active" : ""}" 
                    onclick={() => addSort("first_release_date")}>
                    {#if searchParams.has("sort", "first_release_date")}
                        {#if searchParams.has("order", "asc") || !searchParams.has("order")}
                            <img src="{asc}" alt="...">
                        {:else}
                            <img src="{desc}" alt="...">
                        {/if}
                    {/if}
                    By Date</button>
                </li>
                <li><button class="dropdown-item btn {searchParams.has("sort", "rating") ? "active" : ""}" 
                    onclick={() => addSort("rating")}>
                    {#if searchParams.has("sort", "rating")}
                        {#if searchParams.has("order", "asc") || !searchParams.has("order")}
                            <img src="{asc}" alt="...">
                        {:else}
                            <img src="{desc}" alt="...">
                        {/if}
                    {/if}
                    By Rating</button>
                </li>
                <li>
                    <button class="dropdown-item btn {searchParams.has("sort") ? "" : "active"}" onclick={removeSort}>No Sort</button>
                </li>
            </ul>
        </div>

        <!-- ========== Sort menu ========== -->


        
        <!-- ========== Game List Display ========== -->
        <!-- Displays a list of all games that were found -->

        {#each data as game, i}
            {#if i < gamesPerPage}
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
            {/if}
        {/each}

        <!-- ========== Game List Display ========== -->
    {:else}
        <p>No game found</p>
    {/if}
    

    <!-- Sticky bottom for page switching -->
    <div class="sticky-bottom">
        <div>
            <button class="btn btn-primary {Number(currentPage) <= 1 ? "disabled" : ""}" onclick={() => switchPage(-1)}>&lt;&lt;</button>
            <span>Page {searchParams.has("page") ? searchParams.get("page") : "1"}</span>
            <button class="btn btn-primary" onclick={() => switchPage(1)}>&gt;&gt;</button>
        </div>
    </div>
{/await}
</div>



<!-- ========== Add tag modal ========== -->

<!-- TODO make it so user can add tags to "exclude" aswell -->
<div class="modal fade" tabindex="-1" id="tagModal">

    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Search for a tag</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <h4>Themes</h4>

                {#await getAllThemes()}
                    <p>Loading</p>
                {:then themes} 
                    {#each themes as theme}
                        <button type="button" 
                        class="m-1 btn {searchParams.has("tag", String((0 << 28) | theme.id)) ? "btn-success" : "btn-outline-secondary"}" 
                        onclick={() => addTag((0 << 28) | theme.id)}>
                            {theme.name}
                        </button>
                    {/each}
                {/await}

                <hr>

                <h4>Genres</h4>

                {#await getAllGenre()}
                    <p>Loading</p>
                {:then genres} 
                    {#each genres as genre}
                        <button type="button" 
                        class="m-1 btn {searchParams.has("tag", String((1 << 28) | genre.id)) ? "btn-success" : "btn-outline-secondary"}" 
                        onclick={() => addTag((1 << 28) | genre.id)}>
                            {genre.name}
                        </button>
                    {/each}
                {/await}
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick={() => location.href = `search/?${searchParams}`}>Search</button>
            </div>
        </div>
    </div>
</div>

<!-- ========== Add Tag Modal ========== -->