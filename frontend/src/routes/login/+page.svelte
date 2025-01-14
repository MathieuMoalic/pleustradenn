<script lang="ts">
    import { apiInner } from "$lib/auth";
    import { goto } from "$app/navigation";

    let username = "";
    let password = "";
    let error = "";

    async function login() {
        error = "";
        try {
            const response = await apiInner.token.loginTokenPost({
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

<main class="min-h-screen flex items-center justify-center bg-dark-red">
    <div
        class="bg-gray-800 text-gray-200 rounded-lg shadow-lg p-8 w-full max-w-md"
    >
        <h1 class="text-2xl font-bold text-center mb-6">Login</h1>
        {#if error}
            <p class="text-sm text-red-400 mb-4">{error}</p>
        {/if}
        <form class="space-y-4" on:submit|preventDefault={login}>
            <div>
                <label for="username" class="block text-sm font-medium">
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    bind:value={username}
                    required
                    class="mt-1 block w-full rounded-md bg-gray-700 text-gray-200 border-gray-600 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
            </div>
            <div>
                <label for="password" class="block text-sm font-medium">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    bind:value={password}
                    required
                    class="mt-1 block w-full rounded-md bg-gray-700 text-gray-200 border-gray-600 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
            </div>
            <button
                type="submit"
                class="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Login
            </button>
        </form>
    </div>
</main>
