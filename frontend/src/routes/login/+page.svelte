<script lang="ts">
    import type { ActionData } from "./$types";
    import { page } from "$app/stores"; // Correct import for stores
    export let form: ActionData;
</script>

<div class="flex min-h-screen items-center justify-center bg-black-bean p-4">
    <div class="w-full max-w-md rounded-lg bg-seal-brown p-8 shadow-lg">
        <h1 class="mb-6 text-center text-2xl font-bold text-thistle">Login</h1>

        {#if $page.url.searchParams.get("registered") === "true"}
            <p class="mb-4 rounded bg-green-300 p-3 text-green-900">
                Registration successful! Please log in.
            </p>
        {/if}

        <form method="POST" class="space-y-4">
            {#if form?.error}
                <p class="rounded bg-red-300 p-3 text-red-900">{form.error}</p>
            {/if}
            <div>
                <label
                    for="username"
                    class="mb-1 block text-sm font-medium text-plum"
                    >Username:</label
                >
                <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    class="w-full rounded-md border border-burnt-umber bg-black-bean text-thistle shadow-sm focus:border-plum focus:ring-plum sm:text-sm placeholder-gray-500"
                    value={form?.username ?? ""}
                    placeholder="Enter username"
                />
            </div>
            <div>
                <label
                    for="password"
                    class="mb-1 block text-sm font-medium text-plum"
                    >Password:</label
                >
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    class="w-full rounded-md border border-burnt-umber bg-black-bean text-thistle shadow-sm focus:border-plum focus:ring-plum sm:text-sm placeholder-gray-500"
                    placeholder="Enter password"
                />
            </div>
            <button
                type="submit"
                class="w-full rounded-md bg-burnt-umber py-2 px-4 text-thistle hover:bg-burnt-umber/90 focus:outline-none focus:ring-2 focus:ring-burnt-umber focus:ring-offset-2 focus:ring-offset-seal-brown"
            >
                Login
            </button>
        </form>

        <p class="mt-6 text-center text-sm text-plum">
            Don't have an account?
            <a
                href="/register"
                class="font-medium text-thistle hover:text-plum"
            >
                Register
            </a>
        </p>
    </div>
</div>
