<script lang="ts">
    import {
        openSessionExercise,
        openSessionModal,
        sessionList,
    } from "$lib/session";
    import { EditOutline } from "flowbite-svelte-icons";
</script>

<section>
    <div class="flex flex-col gap-2">
        {#each $sessionList as session}
            <div
                class="bg-burnt-umber text-white p-3 rounded-md shadow-sm flex justify-between items-center"
            >
                <button
                    class="flex flex-col text-left flex-grow"
                    on:click={() => openSessionExercise(session.id)}
                >
                    <h3 class="text-sm font-semibold leading-tight">
                        {session.date}
                    </h3>
                    <p class="text-xs text-thistle mt-0.5">
                        {session.notes}
                    </p>
                </button>
                <button
                    class="flex items-center justify-center bg-plum text-black-bean p-1.5 rounded-md hover:bg-thistle transition duration-200"
                    on:click={() => openSessionModal(session)}
                >
                    <EditOutline class="w-4 h-4" />
                </button>
            </div>
        {/each}
    </div>
</section>
