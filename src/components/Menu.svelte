<script lang="ts">
    import AddExerciseButton from "./AddExerciseButton.svelte";
    import Clock from "./Clock.svelte";
    import ClockButton from "./ClockButton.svelte";
    import { language, t } from "$lib/stores/i18n";
    import { enhance } from "$app/forms";
    export let name: string;
    export let addButtonToggle: boolean = false;
    export let isClockButtonVisible: boolean = false;
    let clockButtonToggle: boolean = false;
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
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                <div class="text-plum font-bold text-lg">{name}</div>
            </div>

            <div class="flex items-center gap-3">
                <AddExerciseButton bind:addButtonToggle />
                {#if isClockButtonVisible}
                    <ClockButton bind:clockButtonToggle />
                {/if}
            </div>
        </div>

        {#if menuOpen}
            <div
                class="flex flex-col px-6 py-4 bg-black-bean border-t border-thistle z-50"
            >
                <a
                    href="/sessions"
                    class="text-plum hover:text-thistle font-semibold text-lg mb-2 transition-transform duration-200"
                    >{$t("session")}</a
                >
                <a
                    href="/exercises"
                    class="text-plum hover:text-thistle font-semibold text-lg mb-2 transition-transform duration-200"
                    >{$t("exercise")}</a
                >

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
                        class="text-plum hover:text-thistle font-semibold text-lg mb-2 text-left transition-transform duration-200"
                        on:click={() => (showLogoutConfirmation = true)}
                    >
                        {$t("logout")}
                    </button>
                {/if}

                <form
                    method="POST"
                    action="/actions/set-language"
                    class="flex items-center gap-3 my-2"
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

    {#if clockButtonToggle}
        <Clock />
    {/if}
</header>
