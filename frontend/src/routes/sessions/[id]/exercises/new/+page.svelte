<script lang="ts">
    export let data;
    import { ExerciseCategory } from "$lib/api"; // your enum
    import { Button, Input } from "flowbite-svelte";
    import PlusMinusInput from "$components/Modal/Input.svelte";

    let selectedExerciseId: number | null = null;
    let filter: ExerciseCategory = ExerciseCategory.Core;
</script>

{#if selectedExerciseId === null}
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Select Exercise</h2>

    <div class="flex flex-wrap gap-2 mb-4">
        {#each Object.values(ExerciseCategory) as cat}
            <Button
                class="px-4 py-2 text-sm rounded-md {filter === cat
                    ? 'bg-seal-brown'
                    : 'bg-burnt-umber'}"
                on:click={() => (filter = cat)}
            >
                {cat}
            </Button>
        {/each}
    </div>

    {#each data.exercises.filter((e) => e.category.name === filter) as exercise}
        <Button on:click={() => (selectedExerciseId = exercise.id)}>
            {exercise.name}
        </Button>
    {/each}
{:else}
    <form method="POST">
        <input type="hidden" name="exercise_id" value={selectedExerciseId} />
        <input type="hidden" name="session_id" value={1} />

        <PlusMinusInput name="sets" value={3} />
        <PlusMinusInput name="reps" value={8} />
        <PlusMinusInput name="weight" value={50} />
        <PlusMinusInput name="rest_seconds" value={90} />
        <PlusMinusInput name="count" value={1} />
        <Input name="notes" placeholder="Enter notes" />
        <label>
            Completed <input type="checkbox" name="completed" />
        </label>

        <Button type="submit">Save</Button>
        <Button on:click={() => (selectedExerciseId = null)}>Back</Button>
    </form>
{/if}
