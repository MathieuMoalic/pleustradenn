<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";
    export let form: ActionData;
</script>

<div class="flex min-h-screen items-center justify-center bg-black-bean p-4">
    <div class="w-full max-w-md rounded-lg bg-seal-brown p-8 shadow-lg">
        <h1 class="mb-6 text-center text-2xl font-bold text-thistle">
            Register
        </h1>

        <form method="POST" class="space-y-4" use:enhance>
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
                    minlength="3"
                    class="w-full rounded-md border border-burnt-umber bg-black-bean text-thistle shadow-sm focus:border-plum focus:ring-plum sm:text-sm placeholder-gray-500"
                    placeholder="Choose a username"
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
                    minlength="6"
                    class="w-full rounded-md border border-burnt-umber bg-black-bean text-thistle shadow-sm focus:border-plum focus:ring-plum sm:text-sm placeholder-gray-500"
                    placeholder="Create a password"
                />
            </div>
            <button
                type="submit"
                class="w-full rounded-md bg-burnt-umber py-2 px-4 text-thistle hover:bg-burnt-umber/90 focus:outline-none focus:ring-2 focus:ring-burnt-umber focus:ring-offset-2 focus:ring-offset-seal-brown"
            >
                Register
            </button>
        </form>

        <p class="mt-6 text-center text-sm text-plum">
            Already have an account?
            <a href="/login" class="font-medium text-thistle hover:text-plum">
                Login
            </a>
        </p>
    </div>
</div>
