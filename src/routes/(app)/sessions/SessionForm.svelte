<script lang="ts">
    import { t } from "$lib/stores/i18n";

    export let session: {
        id: number;
        date: Date;
        notes: string;
    } = {
        id: -1,
        date: new Date(),
        notes: "",
    };
    export let toggleExpand: (sessionId: number) => void;

    function toDateString(d: Date) {
        return d.toISOString().slice(0, 10);
    }

    let dateStr = toDateString(session.date);
    $: session.date = new Date(dateStr);
</script>

<div>
    <input type="hidden" name="id" value={session.id} />
    <div>
        <label for="date" class="block text-sm font-medium text-thistle mb-1">
            {$t("session_date")}
        </label>

        <input
            id="date"
            type="date"
            name="date"
            bind:value={dateStr}
            class="w-full rounded-md border border-burnt-umber bg-black-bean text-thistle
			       shadow-sm sm:text-sm p-2 focus:outline-none"
            required
        />
    </div>

    <div>
        <label for="notes" class="block text-sm font-medium text-thistle mb-1">
            {$t("notes")}
        </label>
        <textarea
            id="notes"
            name="notes"
            bind:value={session.notes}
            rows="1"
            class="w-full rounded-md border border-burnt-umber bg-black-bean text-thistle shadow-sm p-2 focus:outline-none"
        ></textarea>
    </div>

    <div class="flex justify-between gap-2 pt-2">
        {#if session.id >= 0}
            <button
                type="submit"
                formaction="?/update"
                class="w-full rounded-md bg-plum py-2 px-4 text-black-bean hover:bg-plum/90 focus:outline-none focus:ring-2 focus:ring-burnt-umber focus:ring-offset-2 focus:ring-offset-seal-brown"
                >{$t("save")}</button
            >
            <button
                type="submit"
                class="w-full rounded-md bg-red-600 py-2 px-4 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-seal-brown"
                formaction="?/delete"
                formmethod="POST"
            >
                {$t("delete")}
            </button>
            <button
                type="button"
                class="w-full rounded-md bg-plum py-2 px-4 text-black-bean hover:bg-plum/90 focus:outline-none focus:ring-2 focus:ring-burnt-umber focus:ring-offset-2 focus:ring-offset-seal-brown"
                on:click={() => toggleExpand(session.id)}>{$t("close")}</button
            >
        {:else}
            <button
                type="submit"
                formaction="?/create"
                class="w-full rounded-md bg-plum py-2 px-4 text-black-bean hover:bg-plum/90 focus:outline-none focus:ring-2 focus:ring-plum focus:ring-offset-2 focus:ring-offset-seal-brown"
            >
                {$t("save")}
            </button>
        {/if}
    </div>
</div>
