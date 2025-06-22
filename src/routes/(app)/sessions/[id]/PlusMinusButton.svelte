<script>
    import Minus from "$components/icons/Minus.svelte";
    import Plus from "$components/icons/Plus.svelte";

    export let callback = () => {};
    export let plusOrMinus = "plus";
</script>

<button
    type="button"
    on:click={() => callback()}
    class="p-1 rounded bg-burnt-umber text-thistle hover:bg-burnt-umber/90 focus:outline-none focus:ring-1 focus:ring-plum"
    aria-label="Increase intensity"
>
    {#if plusOrMinus === "plus"}
        <Plus />
    {:else}
        <Minus />
    {/if}
</button>
