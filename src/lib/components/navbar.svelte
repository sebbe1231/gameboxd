<script lang="ts">
    import { goto } from "$app/navigation";

    let gameName = $state("")

    function searchGame() {
        goto(`/search/${encodeURIComponent(gameName)}`)
    }
</script>

<nav class="navbar bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand mb-0 h1 text-light" href="/">Gameboxd</a>

        
        <div class="d-flex align-items-center">
            <form onsubmit={e => {
                e.preventDefault();
                searchGame();
            }}>
                <div class="input-group">
                    <input bind:value={gameName} id="gameInput" type="text" class="form-control" placeholder="Game name">
                    <button class="btn btn-primary" type="submit">Button</button>
                </div>
            </form>
            <span class="text-light mx-3 text-center">user</span>
        </div>
        
    </div>    
</nav>