<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/state";
    import type { ActionData as LoginActionData } from "../routes/login/$types";
    import type { ActionData as RegisterActionData } from "../routes/register/$types";

    export let form: LoginActionData | RegisterActionData;
    export let mode: "login" | "register" = "login";

    // Computed values based on mode
    const isLogin = mode === "login";
    const title = isLogin ? "Login" : "Register";
    const buttonLabel = isLogin ? "Login" : "Register";
    const altPrompt = isLogin
        ? "Don't have an account?"
        : "Already have an account?";
    const altLink = isLogin ? "/register" : "/login";
    const altText = isLogin ? "Register" : "Login";
    const username =
        form && "username" in form && typeof form.username === "string"
            ? form.username
            : "";
</script>

<div class="flex min-h-screen items-center justify-center bg-black-bean p-4">
    <div class="w-full max-w-md rounded-lg bg-seal-brown p-8 shadow-lg">
        <h1 class="mb-6 text-center text-2xl font-bold text-thistle">
            {title}
        </h1>

        {#if isLogin && page.url.searchParams.get("registered") === "true"}
            <p class="mb-4 rounded bg-green-300 p-3 text-green-900">
                Registration successful! Please log in.
            </p>
        {/if}

        <form method="POST" class="space-y-4" use:enhance>
            {#if form?.error}
                <p class="rounded bg-red-300 p-3 text-red-900">{form.error}</p>
            {/if}

            <div>
                <label
                    for="username"
                    class="mb-1 block text-sm font-medium text-plum"
                >
                    Username:
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    minlength="3"
                    value={username}
                    class="w-full rounded-md border border-burnt-umber bg-black-bean text-thistle shadow-sm focus:border-plum focus:ring-plum sm:text-sm placeholder-gray-500
                    h-8 p-2"
                    placeholder={isLogin
                        ? "Enter username"
                        : "Choose a username"}
                />
            </div>

            <div>
                <label
                    for="password"
                    class="mb-1 block text-sm font-medium text-plum"
                >
                    Password:
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    minlength="6"
                    class="w-full rounded-md border border-burnt-umber bg-black-bean text-thistle shadow-sm focus:border-plum focus:ring-plum sm:text-sm placeholder-gray-500 h-8 p-2"
                    placeholder={isLogin
                        ? "Enter password"
                        : "Create a password"}
                />
            </div>

            <button
                type="submit"
                class="w-full rounded-md bg-burnt-umber py-2 px-4 text-thistle hover:bg-burnt-umber/90 focus:outline-none focus:ring-2 focus:ring-burnt-umber focus:ring-offset-2 focus:ring-offset-seal-brown"
            >
                {buttonLabel}
            </button>
        </form>

        <p class="mt-6 text-center text-sm text-plum">
            {altPrompt}
            <a href={altLink} class="font-medium text-thistle hover:text-plum">
                {altText}
            </a>
        </p>
    </div>
</div>
