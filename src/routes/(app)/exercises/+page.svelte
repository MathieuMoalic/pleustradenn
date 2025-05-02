<script lang="ts">
    import Menu from "$components/Menu.svelte";
    import type { PageData } from "./$types";
    import ExerciseForm from "./ExerciseForm.svelte";

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
        category_id: 0,
        intensity_unit: "kg",
        name: "",
        notes: "",
    };
    let addingExercise = false;
</script>

<Menu name="Exercises" bind:addButtonToggle={addingExercise} />
<section class="space-y-2 p-2">
    {#if addingExercise}
        <ExerciseForm ex={new_ex} {categories} />
    {/if}

    {#if exercises && exercises.length > 0}
        <div class="flex flex-col gap-2">
            {#each exercises as ex (ex.id)}
                <div
                    class="bg-burnt-umber/95 rounded-md shadow-sm overflow-hidden"
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
