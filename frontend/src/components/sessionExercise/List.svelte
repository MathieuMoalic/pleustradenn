<script lang="ts">
    import {
        editSessionExercise,
        sessionExerciseList,
        fetchSessionExercises,
    } from "$lib/session-exercise";
    import { EditOutline } from "flowbite-svelte-icons";
    import { onMount } from "svelte";

    onMount(fetchSessionExercises);
</script>

<section class="space-y-2">
    <div class="flex flex-col gap-2">
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
                    on:click={() => editSessionExercise(ex)}
                >
                    <EditOutline class="w-4 h-4" />
                </button>
            </div>
        {/each}
    </div>
</section>
