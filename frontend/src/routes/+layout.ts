import { goto } from "$app/navigation";
import { createApiClient } from "$lib/auth";
import { workouts, exercises, workoutExercises, workoutId } from "$lib/store";

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
        api.api.sessionReadAll(),
        api.api.exerciseReadAll(),
        api.api.sessionExerciseReadAll(),
    ]);

    workouts.set(workoutsa.data);
    exercises.set(exercisesa.data);
    workoutExercises.set(workoutExercisesa.data);

    const storedValue = localStorage.getItem("workoutId");
    const initialValue = storedValue ? Number(storedValue) : null;
    workoutId.set(initialValue);
    workoutId.subscribe((value) => {
        if (value !== null) {
            localStorage.setItem("workoutId", String(value));
        } else {
            localStorage.removeItem("workoutId");
        }
    });
}
