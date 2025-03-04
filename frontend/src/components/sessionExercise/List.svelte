<script lang="ts">
    import {
        openSessionExerciseModal,
        sessionExerciseList,
        read,
    } from "$lib/session-exercise";
    import { EditOutline } from "flowbite-svelte-icons";
    import { onMount } from "svelte";

    onMount(read);
</script>

<section class="space-y-2">
    <div class="flex flex-col gap-2">
        {#if $sessionExerciseList.length === 0}
            <p class="text-sm text-gray-500">No exercises added yet</p>
        {/if}
        {#each $sessionExerciseList as ex}
            <div
                class="bg-burnt-umber text-white p-3 rounded-md shadow-sm flex justify-between items-center"
            >
                <div class="flex flex-col">
                    <h3 class="text-sm font-semibold leading-tight">
                        {ex.exercise_name} x {ex.sets} x {ex.reps} @ {ex.weight}kg
                    </h3>
                </div>
                <button
                    class="flex items-center justify-center bg-plum text-black-bean p-1.5 rounded-md hover:bg-thistle transition duration-200"
                    on:click={() => openSessionExerciseModal(ex)}
                >
                    <EditOutline class="w-4 h-4" />
                </button>
            </div>
        {/each}
    </div>
</section>
