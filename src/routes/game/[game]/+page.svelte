<script lang="ts">
    let { params } = $props()
    import missing_image from "$lib/assets/missing_image.png";
    import Swal from "sweetalert2";

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
                    fields *, cover.image_id; 
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
        const resp = await fetch("/api/collection/get", {
            method: "POST",
            body: JSON.stringify({
                userId: "jqYGwmPQ1RE5mtpgdwpf1JKrtQGMGdeB",
                gameId: params.game
            })
        })
        
        const data = await resp.json();

        if(data.success) {
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

    async function removeCollection() {
        const resp = await fetch("/api/collection/remove", {
            method: "POST",
            body: JSON.stringify({
                gameId: params.game
            })
        })

        const data = await resp.json();

        if(data.success) {
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
        <div class="col-sm-4 d-flex justify-content-center">
            {#if game[0].cover}
                <img src="https://images.igdb.com/igdb/image/upload/t_cover_big/{game[0].cover.image_id}.webp" class="rounded float-start img-fluid" alt="Game Cover">
            {:else}
                <img src="{missing_image}" class="rounded float-start img-fluid" alt="Game Cover">
            {/if}
        </div>
        <div class="col-sm-8">
            <ul class="list-group">
                <li class="list-group-item active">Game summary</li>
                <li class="list-group-item">{game[0].summary ? game[0].summary : "No Summary"}</li>
            </ul>
        </div>
    </div>
    {/if}    
{/await}
</div>