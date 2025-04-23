<script lang="ts">
    export let data;
    import { goto } from "$app/navigation";
    import {
        EditOutline,
        FileCopyOutline,
        PlusOutline,
    } from "flowbite-svelte-icons";
</script>

<section>
    <div class="flex flex-col gap-2">
        <button
            on:click={() => goto(`/sessions/new`)}
            class="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-5 bg-opacity-70"
        >
            <PlusOutline class="mr-2" /> Add
        </button>

        {#each data.sessions as session}
            <div
                class="bg-burnt-umber text-white rounded-md shadow-sm w-full flex items-center gap-4"
            >
                <button
                    type="button"
                    on:click={() => goto(`/sessions/${session.id}/exercises`)}
                    class="flex flex-1 items-center gap-3 min-w-0 p-4 pr-0"
                >
                    <div
                        class="text-sm font-semibold leading-tight whitespace-nowrap"
                    >
                        {session.date.toISOString().slice(0, 10)}
                    </div>
                    <div class="flex-grow min-w-0 text-left">
                        <p
                            class="text-xs text-thistle whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                            {session.notes}
                        </p>
                    </div>
                </button>

                <div class="flex flex-shrink-0 ml-auto gap-2 mr-2">
                    <form method="POST">
                        <input
                            type="hidden"
                            name="session_id"
                            value={session.id}
                        />
                        <button
                            type="submit"
                            formaction="?/clone"
                            formmethod="POST"
                            class="flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
                        >
                            <FileCopyOutline class="w-4 h-4" />
                        </button>
                    </form>
                    <button
                        type="button"
                        class="flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
                        on:click={() => goto(`/sessions/${session.id}/edit`)}
                    >
                        <EditOutline class="w-4 h-4" />
                    </button>
                </div>
            </div>
        {/each}
    </div>
</section>
