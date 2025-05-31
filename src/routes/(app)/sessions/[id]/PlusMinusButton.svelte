<script>
    export let callback = () => {};
    export let plusOrMinus = "plus";
</script>

<button
    type="button"
    on:click={() => callback()}
    class="p-3 rounded bg-burnt-umber text-thistle hover:bg-burnt-umber/90 focus:outline-none focus:ring-1 focus:ring-plum border-white border"
    aria-label="Increase intensity"
>
    {#if plusOrMinus === "plus"}
        <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
            ></path></svg
        >
    {:else}
        <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 12H4"
            ></path></svg
        >
    {/if}
</button>
