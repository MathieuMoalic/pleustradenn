import { goto } from "$app/navigation";
import { api, apiInner } from "$lib/auth";
import { workouts, exercises, workoutExercises } from "$lib/store";

export const ssr = false;
export const prerender = true;

export async function load() {
    const token = localStorage.getItem("token");
    if (!token) {
        goto("/login");
    } else {
        apiInner.setSecurityData({ accessToken: token });
    }

    const [workoutsa, exercisesa, workoutExercisesa] = await Promise.all([
        api.workoutReadAll(),
        api.exerciseReadAll(),
        api.workoutExerciseReadAll(),
    ]);

    workouts.set(workoutsa.data);
    exercises.set(exercisesa.data);
    workoutExercises.set(workoutExercisesa.data);
}
