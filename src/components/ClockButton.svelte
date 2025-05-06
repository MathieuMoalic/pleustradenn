<script lang="ts">
    export let clockButtonToggle: boolean;
</script>

<button
    type="button"
    aria-label="Toggle Timer"
    on:click={() => (clockButtonToggle = !clockButtonToggle)}
    class="flex items-center justify-center bg-emerald-400/50 text-white font-semibold rounded-md shadow hover:bg-emerald-700 transition duration-200 h-7 w-7"
>
    {#if !clockButtonToggle}
        <!-- Clock Icon -->
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
