<script lang="ts">
    import { api } from "$lib/auth";
    import { goto } from "$app/navigation";

    let username = "";
    let password = "";
    let error = "";

    async function login() {
        error = "";
        try {
            const response = await api.token.loginTokenPost({
                grant_type: "password",
                username,
                password,
            });

            localStorage.setItem("token", response.data.access_token);

            goto("/");
        } catch (err) {
            error = "Invalid username or password.";
            console.error(err);
        }
    }
</script>

<main class="min-h-screen flex items-center justify-center bg-black-bean">
    <div
        class="bg-seal-brown text-thistle rounded-lg shadow-lg p-8 w-full max-w-md"
    >
        <h1 class="text-2xl font-bold text-center mb-6 text-plum">Login</h1>

        {#if error}
            <p class="text-sm text-burnt-umber mb-4">{error}</p>
        {/if}

        <form class="space-y-4" on:submit|preventDefault={login}>
            <div>
                <label
                    for="username"
                    class="block text-sm font-medium text-thistle"
                >
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    bind:value={username}
                    required
                    class="mt-1 block w-full rounded-md bg-burnt-umber text-thistle border-none shadow-sm focus:ring-plum"
                />
            </div>
            <div>
                <label
                    for="password"
                    class="block text-sm font-medium text-thistle"
                >
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    bind:value={password}
                    required
                    class="mt-1 block w-full rounded-md bg-burnt-umber text-thistle border-none shadow-sm focus:ring-plum"
                />
            </div>
            <button
                type="submit"
                class="w-full bg-plum text-black-bean py-2 px-4 rounded-md shadow hover:bg-thistle transition duration-300"
            >
                Login
            </button>
        </form>
    </div>
</main>
