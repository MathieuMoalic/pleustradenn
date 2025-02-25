<script lang="ts">
    import {
        workoutExercises,
        workouts,
        exercises,
        workoutId,
    } from "$lib/store";
    import type { ExerciseRead, WorkoutExerciseRead } from "$lib/Api";

    // Identify which workout we want
    const wId = Number($workoutId) - 1;
    let workout = $workouts[wId];

    // Build a dictionary keyed by the exercise name, storing an array of WorkoutExerciseRead objects
    let workoutExercisesDict: Record<string, WorkoutExerciseRead[]> = {};

    for (let i = 0; i < $workoutExercises.length; i++) {
        const we = $workoutExercises[i];
        if (we.workout_id === workout.id) {
            const exercise = $exercises[we.exercise_id];
            const { name } = exercise;

            // If there's no entry for this name yet, initialize an empty array
            if (!workoutExercisesDict[name]) {
                workoutExercisesDict[name] = [];
            }

            // Add this workout-exercise entry under that name
            workoutExercisesDict[name].push(we);
        }
    }

    // Form fields for adding a new exercise
    let newExerciseName = "";
    let newExerciseReps: number | null = null;
    let newExerciseRest: number | null = null;
    let newExerciseSets: number | null = null;
    let newExerciseWeight: number | null = null;

    function addExercise() {
        // Here you’d typically create a new exercise in $exercises
        // and/or a new WorkoutExercise in $workoutExercises.
        // The logic will depend on how your store is structured,
        // whether you have an API call, etc.
        console.log("Add exercise:", {
            name: newExerciseName,
            reps: newExerciseReps,
            rest_time: newExerciseRest,
            sets: newExerciseSets,
            weight: newExerciseWeight,
            workout_id: workout?.id,
        });

        // Clear fields (for demo)
        newExerciseName = "";
        newExerciseReps = null;
        newExerciseRest = null;
        newExerciseSets = null;
        newExerciseWeight = null;
    }
</script>

<main class="max-w-3xl mx-auto p-6">
    <!-- Workout details -->
    <div class="bg-black-bean p-6 rounded-lg shadow-md text-thistle">
        <h1 class="text-3xl font-bold text-plum text-center mb-4">
            Workout Details
        </h1>
        <p class="text-xl text-burnt-umber font-semibold">{workout?.date}</p>
        <p class="mt-2">{workout?.notes}</p>
    </div>

    <!-- Exercises by name -->
    <h2 class="text-2xl font-semibold text-plum mt-6">Exercises</h2>
    <div class="mt-4 space-y-4">
        {#each Object.entries(workoutExercisesDict) as [exerciseName, exerciseRecords]}
            <!-- Container for all sets of the same exercise -->
            <div
                class="border-2 border-thistle p-4 rounded-lg bg-seal-brown text-white shadow-lg"
            >
                <h2 class="text-lg font-bold text-thistle mb-2">
                    {exerciseName}
                </h2>

                <!-- Each separate record (e.g. multiple sets) of that exercise -->
                {#each exerciseRecords as ex}
                    <div
                        class="mb-4 border border-thistle p-3 rounded-md text-sm"
                    >
                        <p>
                            <span class="font-semibold text-plum">Reps:</span>
                            {ex.reps}
                        </p>
                        <p>
                            <span class="font-semibold text-plum"
                                >Rest time:</span
                            >
                            {ex.rest_time}
                        </p>
                        <p>
                            <span class="font-semibold text-plum">Sets:</span>
                            {ex.sets}
                        </p>
                        <p>
                            <span class="font-semibold text-plum">Weight:</span>
                            {ex.weight}
                        </p>
                    </div>
                {/each}
            </div>
        {/each}
    </div>

    <!-- Simple form to add a new exercise -->
    <form class="mt-6 space-y-4" on:submit|preventDefault={addExercise}>
        <h2 class="text-xl font-semibold text-plum">Add an Exercise</h2>

        <input
            type="text"
            placeholder="Exercise name"
            bind:value={newExerciseName}
            class="w-full border-2 border-thistle p-2 rounded"
        />
        <input
            type="number"
            placeholder="Reps"
            bind:value={newExerciseReps}
            class="w-full border-2 border-thistle p-2 rounded"
        />
        <input
            type="number"
            placeholder="Rest time"
            bind:value={newExerciseRest}
            class="w-full border-2 border-thistle p-2 rounded"
        />
        <input
            type="number"
            placeholder="Sets"
            bind:value={newExerciseSets}
            class="w-full border-2 border-thistle p-2 rounded"
        />
        <input
            type="number"
            placeholder="Weight"
            bind:value={newExerciseWeight}
            class="w-full border-2 border-thistle p-2 rounded"
        />

        <button type="submit" class="bg-plum text-white py-2 px-4 rounded">
            Add Exercise
        </button>
    </form>
</main>
