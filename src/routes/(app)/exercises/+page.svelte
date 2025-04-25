<script lang="ts">
    import type { PageData } from "./$types";
    import ExerciseForm from "$components/ExerciseForm.svelte";

    export let data: PageData;
    let categories = data.categories;
    let exercises = data.exercises;

    let expandedExerciseId: number | null = null;

    function toggleExpand(exerciseId: number) {
        if (expandedExerciseId === exerciseId) {
            expandedExerciseId = null;
        } else {
            expandedExerciseId = exerciseId;
        }
    }

    let new_ex = {
        id: -1,
        category_id: -1,
        intensity_unit: "kg",
        name: "",
        notes: "",
    };
</script>

<section class="space-y-2 p-4">
    <button
        on:click={() => {
            toggleExpand(-1);
        }}
        class="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-5 bg-opacity-60 w-full"
    >
        <svg
            class="mr-2 w-5 h-5"
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
            ></path>
        </svg>
        Add Exercise
    </button>

    {#if expandedExerciseId === -1}
        <ExerciseForm ex={new_ex} {categories} />
    {/if}

    <h1 class="text-2xl font-bold text-thistle mb-4">Exercises</h1>
    {#if exercises && exercises.length > 0}
        <div class="flex flex-col gap-2">
            {#each exercises as ex (ex.id)}
                <div
                    class="bg-burnt-umber rounded-md shadow-sm overflow-hidden"
                >
                    <button
                        on:click={() => toggleExpand(ex.id)}
                        aria-expanded={expandedExerciseId === ex.id}
                        aria-controls={`exercise-details-${ex.id}`}
                        aria-label={`Toggle details for ${ex.name}`}
                        class="w-full text-left p-3 focus:outline-none focus:ring-2 focus:ring-burnt-umber"
                    >
                        <div class="flex justify-between items-center">
                            <div class="flex flex-col">
                                <h3 class="text-lg font-semibold text-thistle">
                                    {ex.name}
                                </h3>
                                <p class="text-sm text-plum mt-0.5">
                                    {ex.notes || "No notes"}
                                </p>
                            </div>
                            <svg
                                class="w-5 h-5 transition-transform duration-200 {expandedExerciseId ===
                                ex.id
                                    ? 'rotate-180'
                                    : ''} text-plum"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        </div>
                    </button>

                    {#if expandedExerciseId === ex.id}
                        <ExerciseForm {ex} {categories} />
                    {/if}
                </div>
            {/each}
        </div>
    {:else}
        <p class="text-base text-plum">
            No exercises yet. Click "Add New Exercise" to get started!
        </p>
    {/if}
</section>
