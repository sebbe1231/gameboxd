<script lang="ts">
    let { params } = $props()

    async function getGame() {
        const resp = await fetch("/api/IGDB", {
            method: "POST",
            body: JSON.stringify({
                endpoint: "games",
                query: 
                    `
                    fields *, cover.image_id, tags, collections.name, platforms.name, themes.name, genres.name, keywords.name; 
                    where genres.id = ${params.genre_id};
                    `
            })
        });

        return resp.json();
    }
</script>

<!-- I can make all these easier by using IGDB tags, and simply only having /search/tags/[tag] route, instead of having 3 different routes that do the same -->

{#await getGame()}
    <p>Loading...</p>
{:then games} 
    {console.log(games)}
{/await}