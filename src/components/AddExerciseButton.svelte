<script lang="ts">
    export let addButtonCallback: (() => void) | null = null;
    export let addButtonToggle = false;
</script>

<button
    type="button"
    aria-label="Add Exercise"
    on:click={addButtonCallback}
    class="flex items-center justify-center bg-emerald-400/50 text-white font-semibold rounded-md shadow hover:bg-emerald-700 transition duration-200 h-7 w-7"
>
    {#if !addButtonToggle}
        <svg
            class="w-5 h-5 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
            />
        </svg>
    {:else}
        <svg
            class="w-5 h-5 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    {/if}
</button>
