<script>
    export let callback = () => {};
</script>

<button
    type="button"
    on:click={() => callback()}
    class="p-1 rounded-sm bg-burnt-umber text-thistle hover:bg-burnt-umber/90 focus:outline-none focus:ring-1 focus:ring-plum"
    aria-label="Increase intensity"
>
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
</button>
