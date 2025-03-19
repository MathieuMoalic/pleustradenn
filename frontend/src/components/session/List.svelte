<script lang="ts">
    import {
        openSessionExercise,
        openSessionModal,
        clone,
        sessionList,
    } from "$lib/session";
    import { EditOutline, FileCopyOutline } from "flowbite-svelte-icons";
    import AddNewButton from "$components/Modal/AddNewButton.svelte";
</script>

<section>
    <div class="flex flex-col gap-2">
        <AddNewButton name="Session" onclick={openSessionModal} />
        {#each $sessionList as session}
            <div
                class="bg-burnt-umber text-white rounded-md shadow-sm w-full flex items-center gap-4"
            >
                <button
                    on:click={() => openSessionExercise(session.id)}
                    class="flex flex-1 items-center gap-3 min-w-0 p-4 pr-0"
                >
                    <div
                        class="text-sm font-semibold leading-tight whitespace-nowrap"
                    >
                        {session.date}
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
                    <button
                        class="flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
                        on:click={() => clone(session.id)}
                    >
                        <FileCopyOutline class="w-4 h-4" />
                    </button>
                    <button
                        class="flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
                        on:click={() => openSessionModal(session)}
                    >
                        <EditOutline class="w-4 h-4" />
                    </button>
                </div>
            </div>
        {/each}
    </div>
</section>
