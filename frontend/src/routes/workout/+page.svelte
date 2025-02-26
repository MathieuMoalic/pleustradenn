<script lang="ts">
    import {
        sessionExercises,
        sessions,
        exercises,
        sessionId,
    } from "$lib/store";
    import type { SessionExerciseCreate, SessionExerciseRead } from "$lib/Api";
    import { getApi } from "$lib/auth";
    import { addAlert } from "$lib/alert";

    // Identify which session we want
    const wId = Number($sessionId) - 1;
    let session = $sessions[wId];

    // Build a dictionary keyed by the exercise name, storing an array of SessionExerciseRead objects
    let sessionExercisesDict: Record<string, SessionExerciseRead[]> = {};

    for (let i = 0; i < $sessionExercises.length; i++) {
        const we = $sessionExercises[i];
        if (we.session_id === session.id) {
            const exercise = $exercises[we.exercise_id];
            const { name } = exercise;

            // If there's no entry for this name yet, initialize an empty array
            if (!sessionExercisesDict[name]) {
                sessionExercisesDict[name] = [];
            }

            // Add this session-exercise entry under that name
            sessionExercisesDict[name].push(we);
        }
    }

    let newSessionExercise: SessionExerciseCreate = {
        exercise_id: 0,
        session_id: session?.id,
        reps: 0,
        rest_seconds: 0,
        sets: 0,
        weight: 0,
        count: 0,
    };

    function addExercise() {
        getApi()
            .sessionExerciseCreate(newSessionExercise)
            .then((res) => {
                sessionExercises.update((exs) => [...exs, res.data]);
                newSessionExercise = {
                    exercise_id: 0,
                    session_id: session?.id,
                    reps: 0,
                    rest_seconds: 0,
                    sets: 0,
                    weight: 0,
                    count: 0,
                };
                addAlert("Exercise created successfully!", "success");
            })
            .catch((err) => addAlert(err, "error"));
    }
</script>

<main class="max-w-3xl mx-auto p-6">
    <!-- Session details -->
    <div class="bg-black-bean p-6 rounded-lg shadow-md text-thistle">
        <h1 class="text-3xl font-bold text-plum text-center mb-4">
            Session Details
        </h1>
        <p class="text-xl text-burnt-umber font-semibold">{session?.date}</p>
        <p class="mt-2">{session?.notes}</p>
    </div>

    <!-- Exercises by name -->
    <h2 class="text-2xl font-semibold text-plum mt-6">Exercises</h2>
    <div class="mt-4 space-y-4">
        {#each Object.entries(sessionExercisesDict) as [exerciseName, exerciseRecords]}
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
                            {ex.rest_seconds} seconds
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
            placeholder="exercise_id"
            bind:value={newSessionExercise.exercise_id}
            class="w-full border-2 border-thistle p-2 rounded"
        />

        <input
            type="number"
            placeholder="Reps"
            bind:value={newSessionExercise.reps}
            class="w-full border-2 border-thistle p-2 rounded"
        />

        <input
            type="number"
            placeholder="Rest time (seconds)"
            bind:value={newSessionExercise.rest_seconds}
            class="w-full border-2 border-thistle p-2 rounded"
        />

        <input
            type="number"
            placeholder="Sets"
            bind:value={newSessionExercise.sets}
            class="w-full border-2 border-thistle p-2 rounded"
        />

        <input
            type="number"
            placeholder="Weight"
            bind:value={newSessionExercise.weight}
            class="w-full border-2 border-thistle p-2 rounded"
        />

        <input
            type="number"
            placeholder="Count"
            bind:value={newSessionExercise.count}
            class="w-full border-2 border-thistle p-2 rounded"
        />

        <button type="submit" class="bg-plum text-white py-2 px-4 rounded">
            Add Exercise
        </button>
    </form>
</main>
