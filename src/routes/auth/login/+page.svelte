<script lang="ts">
    import Modal from "$lib/components/auth/login-modal.svelte"
    import { user } from "$lib/state.svelte";

    let username = $state("");
    let password = $state("");

    let success_text = $state("");

    async function loginUser() {
        const resp = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                name: username,
                password: password
            })
        })

        const data = await resp.json();

        if(data.success) {
            success_text = "Login succesful";
            user.name = data.data.userData.name;
            user.id = data.data.userData.id;
        } else {
            success_text = "Wrong username or password";
        }

        return resp.json()
    }
</script>

<div class="container text-center">
    <div class="w-25 mx-auto mt-3">
        <form onsubmit={e => {
                        e.preventDefault();
                        loginUser();
                    }}>
            <div class="mb-3">
                <label for="usernameInput" class="form-label">Username</label>
                <input bind:value={username} type="text" class="form-control" id="usernameInput" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
                <label for="passwordInput" class="form-label">Password</label>
                <input bind:value={password} type="password" class="form-control" id="passwordInput">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
    <p>{success_text}</p>
</div>

<!-- {#await getUser()}
    WAITTTTTT
{:then user} 
    {user}
{/await} -->