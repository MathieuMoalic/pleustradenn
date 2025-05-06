<script lang="ts">
    import AddExerciseButton from "./AddExerciseButton.svelte";
    import ClockButton from "./ClockButton.svelte";

    export let name: string;
    export let addButtonToggle: boolean;
    export let clockButtonToggle: boolean | null = null;
    let menuOpen = false;
    let showLogoutConfirmation = false;
</script>

<header class="top-0 left-0 right-0 z-20 bg-black-bean border-b border-thistle">
    <div
        class="flex items-center justify-between pl-6 pr-2 py-2 max-w-7xl mx-auto w-full"
    >
        <div class="flex items-center gap-4">
            <button
                class="text-plum hover:text-thistle focus:outline-none md:hidden"
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
            {#if clockButtonToggle !== null}
                <ClockButton bind:clockButtonToggle />
            {/if}
        </div>
    </div>

    {#if menuOpen}
        <div
            class="flex flex-col px-6 py-4 md:hidden bg-black-bean border-t border-thistle"
        >
            <a
                href="/sessions"
                class="text-plum hover:text-thistle font-semibold text-lg mb-2 transition-transform duration-200"
                >Sessions</a
            >
            <a
                href="/exercises"
                class="text-plum hover:text-thistle font-semibold text-lg mb-2 transition-transform duration-200"
                >Exercises</a
            >

            {#if showLogoutConfirmation}
                <div
                    class="flex items-center text-plum font-semibold text-lg mb-2"
                >
                    Logout?
                    <form
                        method="POST"
                        action="/logout"
                        class="flex items-center"
                    >
                        <button
                            type="submit"
                            class="ml-2 px-3 py-1 bg-thistle text-black-bean rounded text-sm hover:bg-plum hover:text-thistle transition-colors duration-200"
                        >
                            Yes
                        </button>
                    </form>
                    <button
                        class="ml-2 px-3 py-1 bg-thistle text-black-bean rounded text-sm hover:bg-plum hover:text-thistle transition-colors duration-200"
                        on:click={() => (showLogoutConfirmation = false)}
                    >
                        No
                    </button>
                </div>
            {:else}
                <button
                    class="text-plum hover:text-thistle font-semibold text-lg mb-2 text-left transition-transform duration-200"
                    on:click={() => (showLogoutConfirmation = true)}
                >
                    Logout
                </button>
            {/if}
        </div>
    {/if}
</header>
