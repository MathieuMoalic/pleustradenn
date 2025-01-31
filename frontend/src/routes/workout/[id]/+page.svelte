<script lang="ts">
    import { workoutExercises, workouts, exercises } from "$lib/store";
    import { page } from "$app/state";
    import type { ExerciseRead, WorkoutExerciseRead } from "$lib/Api";

    let workout = $workouts[Number(page.params.id) - 1];

    let thisWorkoutExercises: WorkoutExerciseRead[] = [];
    let thisExercise: ExerciseRead[] = [];

    for (let i = 0; i < $workoutExercises.length; i++) {
        if ($workoutExercises[i].workout_id === workout.id) {
            thisWorkoutExercises.push($workoutExercises[i]);
            thisExercise.push($exercises[$workoutExercises[i].exercise_id]);
        }
    }
</script>

<main>
    <div class="block">
        {workout.notes}
    </div>
    <div>
        {#each thisExercise as ex}
            <div class="border-2 p-2">
                <h2>{ex.name}</h2>
                <div>
                    <div class="text-xs">category: {ex.category}</div>
                    <div class="text-xs">description: {ex.description}</div>
                    <div class="text-xs">equipment: {ex.equipment}</div>
                    <div class="text-xs">muscle_group: {ex.muscle_group}</div>
                </div>
            </div>
        {/each}
    </div>
</main>
