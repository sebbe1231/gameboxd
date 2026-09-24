<script lang="ts">
    import { goto } from "$app/navigation";
    let gameName = $state("")

    function searchGame() {
        goto(`./search/${encodeURIComponent(gameName)}`)
    }

    async function getPopular() {
        const resp = await fetch("/API/IGDB", {
            method: "POST",
            body: JSON.stringify({
                endpoint: "games",
                query: 
                    `
                    fields name, id, cover.image_id, rating, rating_count;
                    limit 5;
                    sort rating desc;
                    where rating_count >= 1000;
                    `
            })
        })

        return resp.json()

    }

    async function getNew() {
        let date = Math.floor(Date.now() / 1000) 

        const resp = await fetch("/API/IGDB", {
            method: "POST",
            body: JSON.stringify({
                endpoint: "games",
                query: 
                    `
                    fields name, id, cover.image_id, first_release_date;
                    limit 5;
                    sort first_release_date desc;
                    where first_release_date <= ${date};
                    `
            })
        })

        return resp.json();
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
    
    <h5>Top 5 Games</h5>
    <div class="row">
        {#await getPopular()}
            <p>Loading games...</p>
        {:then games} 
            {console.log(games)}
            {#each games as game}
                <div class="card col m-3" style="padding-left: 0px; padding-right: 0px;">
                <div class="card-header">
                    {Math.round(game.rating * 100) / 100}/100 ({game.rating_count} reviews)
                </div>
                    <div class="card-body p-0 text-bg-secondary rounded">
                        <img src="https://images.igdb.com/igdb/image/upload/t_cover_big/{game.cover.image_id}.webp" class="card-img-top" alt="...">

                        <p class="card-text px-2 py-2 text-nowrap text-truncate">
                            <a href="/game/{game.id}" class="stretched-link text-light " style="text-decoration: none;">{game.name}</a>
                        </p>
                        
                    </div>
                </div>
            {/each}
        {/await}
    </div>

    <h5>Newest Games On IGDB</h5>
    <div class="row">
        {#await getNew()}
            <p>Loading games...</p>
        {:then games} 
            {console.log(games)}
            {#each games as game}
                <div class="card col m-3" style="padding-left: 0px; padding-right: 0px;">
                <div class="card-header">
                    {let releaseDate = new Date(game.first_release_date * 1000)}
                    {releaseDate.getDate()}/{releaseDate.getMonth() + 1} - {releaseDate.getFullYear()}
                </div>
                    <div class="card-body p-0 text-bg-secondary rounded">
                        <img src="https://images.igdb.com/igdb/image/upload/t_cover_big/{game.cover.image_id}.webp" class="card-img-top" alt="...">

                        <p class="card-text px-2 py-2 text-nowrap text-truncate">
                            <a href="/game/{game.id}" class="stretched-link text-light " style="text-decoration: none;">{game.name}</a>
                        </p>
                        
                    </div>
                </div>
            {/each}
        {/await}
    </div>
</div>