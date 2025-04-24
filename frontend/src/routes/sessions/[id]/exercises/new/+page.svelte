<script lang="ts">
    import { Button } from "flowbite-svelte";
    import SessionExerciseForm from "$components/SessionExerciseForm.svelte";
    import type { SessionExerciseFormData } from "$lib/types.js";
    import type { Exercise } from "@prisma/client";
    import { page } from "$app/state";

    export let data;
    let exercises = data.exercises;
    let sessionExercise: SessionExerciseFormData = {
        exercise: exercises[0],
        count: 0,
        reps: 0,
        sets: 0,
        notes: "",
        weight: 0,
        success: false,
        completed: false,
        created_at: new Date(),
        session_id: parseInt(page.params.id),
        exercise_id: 0,
        rest_seconds: 0,
        id: undefined,
    };
    let exercise_selected = false;
    let filter = data.categories[0];

    function selectExercise(ex: Exercise) {
        sessionExercise.exercise_id = ex.id;
        sessionExercise.exercise = ex;
        exercise_selected = true;
    }
</script>

{#if !exercise_selected}
    <h2 class="text-xl font-semibold text-gray-200 mb-4">Select Exercise</h2>

    <div class="flex flex-wrap gap-2 mb-4">
        {#each data.categories as cat}
            <Button
                class="px-4 py-2 text-sm rounded-md {filter === cat
                    ? 'bg-burnt-umber'
                    : 'bg-black-bean'}"
                on:click={() => (filter = cat)}
            >
                {cat.name.toUpperCase()}
            </Button>
        {/each}
    </div>

    <div class="flex flex-col gap-2">
        {#each data.exercises.filter((e) => e.category.name === filter.name) as ex}
            <Button
                on:click={() => selectExercise(ex)}
                class="bg-burnt-umber text-white p-3 rounded-md shadow-sm flex"
            >
                <div class="flex items-center h-2">
                    <h3 class="text-sm font-semibold text-left">
                        {ex.name}
                    </h3>
                </div>
            </Button>
        {/each}
    </div>
{:else}
    <h3 class="text-plum">Add Exercise to Session</h3>
    <SessionExerciseForm {exercises} {sessionExercise} />
{/if}
