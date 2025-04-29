<script lang="ts">
    import type { Exercise, ExerciseCategory } from "@prisma/client";

    export let categories: ExerciseCategory[] = [];
    export let exercises: Exercise[] = [];

    let category_id = 0;
    let state = "collapsed"; // collapsed, pickCategory, pickExercise

    function filterExercisesByCategory(categoryId: number): Exercise[] {
        return exercises.filter(
            (exercise) => exercise.category_id === categoryId,
        );
    }
</script>

<div
    class="border border-burnt-umber rounded p-4 shadow-lg max-w-md mx-auto mb-4"
>
    {#if state == "collapsed"}
        <button
            type="button"
            on:click={() => (state = "pickCategory")}
            class="flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-emerald-700 transition duration-200 w-full"
        >
            <span>Add Exercise</span>
            <svg
                class="w-5 h-5 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                />
            </svg>
        </button>
    {:else if state == "pickCategory"}
        <div class="flex flex-col items-center gap-4">
            {#if categories.length === 0}
                <p class="text-base text-plum">
                    No categories available. Please add a category first.
                </p>
                <button
                    type="button"
                    on:click={() => (state = "collapsed")}
                    class="bg-plum text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-burnt-umber transition duration-200"
                >
                    Back
                </button>
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
            action="?/create"
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
