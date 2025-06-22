<script lang="ts">
    import { language, t } from "$lib/stores/i18n";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import Hamburger from "./icons/Hamburger.svelte";

    export let name: string;
    let menuOpen = false;
    let showLogoutConfirmation = false;
    function handleEnhance({}: {
        action: URL;
        formData: FormData;
        formElement: HTMLFormElement;
        controller: AbortController;
        submitter: HTMLElement | null;
        cancel: () => void;
    }) {
        return async ({ result }: { result: any }) => {
            menuOpen = false; // Close the menu after form submission
            if (result.success) {
                language.set(result.lang);
            }
        };
    }
</script>

<header class="sticky top-0 z-20">
    <div class="bg-black-bean">
        <div
            class="flex items-center justify-between pl-6 pr-2 py-2 max-w-7xl mx-auto w-full"
        >
            <div class="flex items-center gap-4">
                <button
                    class="text-plum hover:text-thistle focus:outline-none"
                    on:click={() => (menuOpen = !menuOpen)}
                    aria-label="Toggle menu"
                >
                    <Hamburger className="w-6 h-6" />
                </button>

                <div class="text-plum font-bold text-lg">
                    {#if !menuOpen}
                        {name}
                    {:else}
                        Menu
                    {/if}
                </div>
            </div>

            <slot name="actions" />
        </div>

        {#if menuOpen}
            <div
                class="flex flex-col px-6 py-4 bg-black-bean border-t border-thistle z-50"
            >
                <button
                    class="text-plum hover:text-thistle font-semibold text-lg mb-2 transition-transform duration-200"
                    on:click={() => (goto("/sessions"), (menuOpen = false))}
                >
                    {$t("session")}
                </button>
                <button
                    class="text-plum hover:text-thistle font-semibold text-lg mb-2 transition-transform duration-200"
                    on:click={() => (goto("/exercises"), (menuOpen = false))}
                >
                    {$t("exercise")}
                </button>

                {#if showLogoutConfirmation}
                    <div
                        class="flex items-center text-plum font-semibold text-lg mb-2"
                    >
                        {$t("logout")} ?
                        <form
                            method="POST"
                            action="/logout"
                            class="flex items-center"
                        >
                            <button
                                type="submit"
                                class="ml-2 px-3 py-1 bg-thistle text-black-bean rounded text-sm hover:bg-plum hover:text-thistle transition-colors duration-200"
                            >
                                {$t("yes")}
                            </button>
                        </form>
                        <button
                            class="ml-2 px-3 py-1 bg-thistle text-black-bean rounded text-sm hover:bg-plum hover:text-thistle transition-colors duration-200"
                            on:click={() => (showLogoutConfirmation = false)}
                        >
                            {$t("no")}
                        </button>
                    </div>
                {:else}
                    <button
                        class="text-plum hover:text-thistle font-semibold text-lg mb-2 transition-transform duration-200"
                        on:click={() => (showLogoutConfirmation = true)}
                    >
                        {$t("logout")}
                    </button>
                {/if}

                <form
                    method="POST"
                    action="/actions/set-language"
                    class="flex justify-center items-center gap-3 my-2"
                    use:enhance={handleEnhance}
                >
                    <button
                        class="lang-flag"
                        aria-label="English"
                        type="submit"
                        name="lang"
                        value="en">🇬🇧</button
                    >
                    <button
                        class="lang-flag"
                        aria-label="Polski"
                        type="submit"
                        name="lang"
                        value="pl">🇵🇱</button
                    >
                    <button
                        class="lang-flag"
                        aria-label="Français"
                        type="submit"
                        name="lang"
                        value="fr">🇫🇷</button
                    >
                </form>
            </div>
        {/if}
    </div>
    <hr />
</header>
