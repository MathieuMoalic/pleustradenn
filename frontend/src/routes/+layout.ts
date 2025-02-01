import { goto } from "$app/navigation";
import { createApiClient } from "$lib/auth";
import { workouts, exercises, workoutExercises } from "$lib/store";

export const ssr = false;
export const prerender = true;

export async function load({ fetch }) {
    const api = createApiClient(fetch);

    const token = localStorage.getItem("token");
    if (!token) {
        goto("/login");
        return;
    } else {
        api.setSecurityData({ accessToken: token });
    }

    const [workoutsa, exercisesa, workoutExercisesa] = await Promise.all([
        api.api.workoutReadAll(),
        api.api.exerciseReadAll(),
        api.api.workoutExerciseReadAll(),
    ]);

    workouts.set(workoutsa.data);
    exercises.set(exercisesa.data);
    workoutExercises.set(workoutExercisesa.data);
}
