<script lang="ts">
    import type { Exercise, ExerciseCategory } from "@prisma/client";

    export let categories: ExerciseCategory[] = [];
    export let exercises: Exercise[] = [];

    let category_id = 0;
    let state = "pickCategory"; // pickCategory, pickExercise

    function filterExercisesByCategory(categoryId: number): Exercise[] {
        return exercises.filter(
            (exercise) => exercise.category_id === categoryId,
        );
    }
</script>

<div class=" rounded p-4 shadow-lg max-w-md mx-auto mb-4">
    {#if state == "pickCategory"}
        <div class="flex flex-col items-center gap-4">
            {#if categories.length === 0}
                <p class="text-base text-plum">
                    No categories available. Please add a category first.
                </p>
            {:else}
                <div class="flex flex-col gap-2 w-full">
                    {#each categories as category (category.id)}
                        <button
                            type="button"
                            on:click={() => {
                                state = "pickExercise";
                                category_id = category.id;
                            }}
                            class="bg-seal-brown text-thistle font-semibold py-2 px-4 rounded-md shadow-md hover:bg-burnt-umber transition duration-200 w-full"
                        >
                            {category.name}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    {:else if state == "pickExercise"}
        <form
            action="?/create_session_exercise"
            method="POST"
            class="flex flex-col gap-4 w-full"
        >
            {#each filterExercisesByCategory(category_id) as exercise (exercise.id)}
                <button
                    type="submit"
                    name="exercise_id"
                    value={exercise.id}
                    class="bg-seal-brown text-thistle font-semibold py-2 px-4 rounded-md shadow-md hover:bg-burnt-umber transition duration-200 w-full"
                >
                    {exercise.name}
                </button>
            {/each}
            <button
                type="button"
                on:click={() => (state = "pickCategory")}
                class="text-plum hover:underline mt-2 text-sm"
            >
                ← Back to categories
            </button>
        </form>
    {/if}
</div>
