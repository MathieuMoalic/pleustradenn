<script lang="ts">
    import { login } from "$lib/auth";
    let username = "";
    let password = "";
</script>

<main class="min-h-screen flex items-center justify-center bg-seal-brown">
    <div class=" text-thistle rounded-lg p-8 w-full max-w-md">
        <form
            class="space-y-4"
            on:submit|preventDefault={() => login(username, password)}
        >
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
