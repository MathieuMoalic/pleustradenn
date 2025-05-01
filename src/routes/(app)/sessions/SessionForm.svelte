<script lang="ts">
    import { Datepicker } from "flowbite-svelte";
    export let session: {
        id: number;
        date: Date;
        notes: string;
    };
</script>

<form method="POST" class="space-y-4">
    <input type="hidden" name="id" value={session.id} />

    <div class="md:w-1/2 flex justify-center items-center">
        <Datepicker bind:value={session.date} inline color="red" />
        <input type="hidden" name="date" value={session.date} />
    </div>

    <div>
        <label for="notes" class="block text-sm font-medium text-thistle mb-1"
            >Notes</label
        >
        <textarea
            id="notes"
            name="notes"
            bind:value={session.notes}
            rows="3"
            class="w-full rounded-md border border-burnt-umber bg-black-bean text-thistle shadow-sm focus:border-plum focus:ring-plum sm:text-sm p-2"
        ></textarea>
    </div>

    <div class="flex justify-between gap-2 pt-4">
        {#if session.id >= 0}
            <button
                type="submit"
                formaction="?/update"
                class="w-full rounded-md bg-plum py-2 px-4 text-black-bean hover:bg-plum/90 focus:outline-none focus:ring-2 focus:ring-burnt-umber focus:ring-offset-2 focus:ring-offset-seal-brown"
                >Save</button
            >
            <button
                type="submit"
                class="w-full rounded-md bg-red-600 py-2 px-4 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-seal-brown"
                formaction="?/delete"
                formmethod="POST"
            >
                Delete
            </button>
        {:else}
            <button
                type="submit"
                formaction="?/create"
                class="w-full rounded-md bg-plum py-2 px-4 text-black-bean hover:bg-plum/90 focus:outline-none focus:ring-2 focus:ring-plum focus:ring-offset-2 focus:ring-offset-seal-brown"
            >
                Add Session
            </button>
        {/if}
    </div>
</form>
