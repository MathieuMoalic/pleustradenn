<script lang="ts">
    import type { Exercise } from "@prisma/client";
    import { exerciseNamei18n, t, cs } from "$lib/stores/i18n";

    export let exercises: Exercise[] = [];

    let category: string = "other";
    let state: "pickCategory" | "pickExercise" = "pickCategory";

    function filterExercisesByCategory(category: string): Exercise[] {
        return exercises.filter((exercise) => exercise.category === category);
    }
</script>

<div class=" rounded p-4 shadow-lg max-w-md mx-auto mb-4">
    {#if state == "pickCategory"}
        <div class="flex flex-col items-center gap-4">
            <div class="flex flex-col gap-2 w-full">
                {#each Object.entries($cs) as [key, label]}
                    <button
                        type="button"
                        on:click={() => {
                            state = "pickExercise";
                            category = key;
                        }}
                        class="bg-seal-brown text-thistle font-semibold py-2 px-4 rounded-md shadow-md hover:bg-burnt-umber transition duration-200 w-full"
                    >
                        {label}
                    </button>
                {/each}
            </div>
        </div>
    {:else if state == "pickExercise"}
        <form
            action="?/create_session_exercise"
            method="POST"
            class="flex flex-col gap-4 w-full"
        >
            {#each filterExercisesByCategory(category) as exercise (exercise.id)}
                <button
                    type="submit"
                    name="exercise_id"
                    value={exercise.id}
                    class="bg-seal-brown text-thistle font-semibold py-2 px-4 rounded-md shadow-md hover:bg-burnt-umber transition duration-200 w-full"
                >
                    {exerciseNamei18n(exercise)}
                </button>
            {/each}
            <button
                type="button"
                on:click={() => (state = "pickCategory")}
                class="text-plum hover:underline mt-2 text-sm"
            >
                ← {$t("back_to_categories")}
            </button>
        </form>
    {/if}
</div>
