<script lang="ts">
    import { goto } from "$app/navigation";
    import { authClient } from "$lib/auth-client";
    import Swal from "sweetalert2";

    const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });

    let username = $state("");
    let password = $state("");
    let email = $state("");

    async function signUp() {
        const { data, error } = await authClient.signUp.email({
            email: email,
            password: password,
            name: username
        }, {
            onSuccess: () => {
                toast.fire({
                    icon: "success",
                    title: "Account Registerd"
                })
                goto("/")
            },
            onError: (ctx) => {
                toast.fire({
                    icon: "error",
                    title: ctx.error.message
                })
            }
        })
    }
</script>

<div class="container text-center">
    <div class="w-25 mx-auto mt-3">
        <form onsubmit={e => {
                        e.preventDefault();
                        signUp();
                    }}>
            <div class="mb-3">
                <label for="emailInput" class="form-label">Email</label>
                <input bind:value={email} type="email" class="form-control" id="emailInput">
            </div>
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
        <div>
            <a style="text-decoration: none;" class="text-info-emphasis" href="/auth/signin">Already have an account?</a>
        </div>
    </div>
</div>