<script lang="ts">
    import { goto } from "$app/navigation";
    import { authClient } from "$lib/auth-client";
    import Swal from "sweetalert2";

    let gameName = $state("")

    const session = authClient.useSession();

    const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });

    async function signOut() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: (ctx) => {
                    toast.fire({
                        icon: "success",
                        title: "Logged Out"
                    })
                },
                onError: (ctx) => {
                    toast.fire({
                        icon: "error",
                        title: ctx.error.message
                    })
                }
            }
        })
    }
        
    function searchGame() {
        goto(`/search/${encodeURIComponent(gameName)}`)
        gameName = "";
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
            <div class="text-center ms-3">
                {#if $session.isPending}
                    <span class="text-light">Loading...</span>
                {:else if $session.data}
                    <div class="dropdown">
                        <button class="btn dropdown-toggle text-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                             {$session.data?.user.name}
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end text-center">
                            <li><a href="/user" class="text-dark" style="text-decoration: none;">Profile</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><button class="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target="#signout-modal">Logout</button></li>
                        </ul>
                    </div>
                {:else}
                    <div>
                        <a class="btn btn-outline-primary" href="/auth/signin" role="button">Login</a>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</nav>

<div class="modal fade" id="signout-modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header justify-content-center">
                <h5 class="modal-title">Are you sure you want to logout?</h5>
            </div>
            <div class="modal-footer justify-content-center">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick={signOut}>Logout</button>
            </div>
        </div>
    </div>
</div>