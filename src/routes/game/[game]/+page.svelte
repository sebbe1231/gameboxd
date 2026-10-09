<script lang="ts">
    let { params } = $props()
    import missing_image from "$lib/assets/missing_image.png";
    import Swal from "sweetalert2";
    import backpack from "$lib/assets/backpack.svg";
    import { authClient } from "$lib/auth-client.js";

    let hasGame = $state(false);
    let totalCollection = $state(0);
    let keywordToggle = $state(false);

    const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });

    async function getGame() {
        const resp = await fetch("/api/IGDB", {
            method: "POST",
            body: JSON.stringify({
                endpoint: "games",
                query: 
                    `
                    fields *, cover.image_id, tags, collections.name, platforms.name, themes.name, genres.name, keywords.name; 
                    where id = ${params.game};
                    `
            })
        });

        return resp.json();
    }


    async function addToCollection() {
        const resp = await fetch("/api/collection/add", {
            method: "POST",
            body: JSON.stringify({
                gameId: params.game
            })
        })

        const data = await resp.json()

        if(data.success) {
            hasGame = true;
            totalCollection += 1;
            toast.fire({
                icon: "success",
                title: data.message
            })
        }
        else {
            toast.fire({
                icon: "error",
                title: data.message
            })
        }
    }

    async function getCollection() {
        const session = await authClient.getSession()

        if(session.data) {
            const usr = await fetch("/api/collection/get", {
                method: "POST",
                body: JSON.stringify({
                    userId: session.data.user.id,
                    gameId: params.game
                })
            })

            const result = await usr.json()

            if(result.data.length >= 1) {
                hasGame = true;
            }
        }
        

        const resp = await fetch("/api/collection/get", {
            method: "POST",
            body: JSON.stringify({
                gameId: params.game
            })
        })
        
        const result = await resp.json();

        totalCollection = result.data.length
    }

    async function removeCollection() {
        const resp = await fetch("/api/collection/remove", {
            method: "POST",
            body: JSON.stringify({
                gameId: params.game
            })
        })

        const data = await resp.json();

        if(data.success) {
            hasGame = false;
            totalCollection -= 1;
            toast.fire({
                icon: "success",
                title: data.message
            })
        }
        else {
            toast.fire({
                icon: "error",
                title: data.message
            })
        }
    }
</script>

<div class="container text-center">
{#await getGame()}
    <p>Loading game...</p>
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
{:then game} 
    {#if !game[0]}
        <h3 class="text-danger text-center">Could not find game with ID {params.game} :/</h3>
    {:else}
        {console.log(game[0])}
        <h3 class="text-center">{game[0].name}</h3>
        {#if game[0].first_release_date}
            {let releaseDate = new Date(game[0].first_release_date * 1000)}
            <p>{releaseDate.getDate()}/{releaseDate.getMonth() + 1}/{releaseDate.getFullYear()}</p>
        {:else}
            <p>No release date</p>
        {/if}

    <div class="row">
        <div class="col-sm-4 d-flex flex-column">
            <div class="align-self-center">
                {#if game[0].cover}
                    <img src="https://images.igdb.com/igdb/image/upload/t_cover_big/{game[0].cover.image_id}.webp" class="rounded float-start img-fluid" alt="Game Cover">
                {:else}
                    <img src="{missing_image}" class="rounded float-start img-fluid" alt="Game Cover">
                {/if}
            </div>
            <div class="mt-2">
                {#await getCollection()}
                    <button type="button" class="btn btn-secondary rounded-pill text-dark">
                        <img src="{backpack}" alt="..."> ...
                    </button>
                {:then} 
                    <button type="button" 
                        class="btn {hasGame ? "btn-success" : "btn-secondary"} rounded-pill text-dark"  
                        onclick={hasGame ?  removeCollection : addToCollection}>
                        <img src="{backpack}" alt="..."> {totalCollection}
                    </button>
                {/await}
            </div>
            <div class="">
                <p>hej</p>
            </div>


            <!-- TODO make card body clicable/a button to add to collection -->
            <!-- <div class="card align-self-center" style="width: 18rem;">
                {#if game[0].cover}
                    <img src="https://images.igdb.com/igdb/image/upload/t_cover_big/{game[0].cover.image_id}.webp" class="rounded-top float-start img-fluid" alt="Game Cover">
                {:else}
                    <img src="{missing_image}" class="rounded-top float-start img-fluid" alt="Game Cover">
                {/if}
                <div class="card-body rounded-bottom text-bg-secondary">
                    <h5 class="card-title">Card title</h5>
                </div>
            </div> -->
        </div>
        <div class="col-sm-8">
            <ul class="list-group">
                <li class="list-group-item active">Game summary</li>
                <li class="list-group-item">{game[0].summary ? game[0].summary : "No Summary"}</li>
                <li class="list-group-item d-flex justify-content-center px-0 text-center">
                    <div class="row w-100">
                        <div class="col-4 border-end">
                            <h6>Genres</h6>
                            <div class="d-flex flex-wrap justify-content-center">
                                {#each game[0].genres as genre}
                                <a class="border rounded-pill text-center overflow-hidden px-2 mt-1 hover-object text-dark" href="/search/genre/{genre.id}" style="text-decoration: none;">{genre.name}</a>
                                {/each}
                            </div>
                        </div>
                        <div class="col-4">
                            <h6>Themes</h6>
                            <div class="d-flex flex-wrap justify-content-center">
                                {#each game[0].themes as theme}
                                <a class="border rounded-pill text-center overflow-hidden px-2 mt-1 hover-object text-dark" href="/search/theme/{theme.id}" style="text-decoration: none;">{theme.name}</a>
                                {/each}
                            </div>
                        </div>
                        <div class="col-4 border-start">
                            <h6>Keywords</h6>
                            <div class="collapse mb-2" id="keywordCollapse">
                                <div class="d-flex flex-wrap justify-content-center">
                                    {#each game[0].keywords as keyword}
                                    <a class="border rounded-pill text-center overflow-hidden px-2 mt-1 hover-object text-dark" href="/search/keyword/{keyword.id}" style="text-decoration: none;">{keyword.name}</a>
                                    {/each}
                                </div>
                            </div>
                            <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#keywordCollapse" aria-expanded="false" aria-controls="keywordCollapse" onclick={() => keywordToggle = !keywordToggle}>
                                {keywordToggle ? "Hide Keywords" : "Show Keywords"}
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    {/if}    
{/await}
</div>