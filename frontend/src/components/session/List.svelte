<script lang="ts">
    import {
        openSessionExercise,
        openSessionModal,
        sessionList,
    } from "$lib/session";
    import { EditOutline } from "flowbite-svelte-icons";
    import AddNewButton from "$components/Modal/AddNewButton.svelte";
</script>

<section>
    <div class="flex flex-col gap-2">
        <AddNewButton name="Session" onclick={openSessionModal} />
        {#each $sessionList as session}
            <div
                class="bg-burnt-umber text-white rounded-md shadow-sm w-full flex items-center p-3 gap-2"
            >
                <button
                    class="flex-shrink-0 text-sm font-semibold leading-tight"
                    on:click={() => openSessionExercise(session.id)}
                >
                    {session.date}
                </button>
                <button
                    class="flex-grow min-w-0 text-left"
                    on:click={() => openSessionExercise(session.id)}
                >
                    <p
                        class="text-xs text-thistle whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                        {session.notes}
                    </p>
                </button>
                <button
                    class="flex-shrink-0 flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
                    on:click={() => openSessionModal(session)}
                >
                    <EditOutline class="w-4 h-4" />
                </button>
            </div>
        {/each}
    </div>
</section>
