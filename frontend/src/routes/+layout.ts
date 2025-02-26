import { goto } from "$app/navigation";
import { createApiClient } from "$lib/auth";
import { sessions, exercises, sessionExercises, sessionId } from "$lib/store";

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

    const [sessionsa, exercisesa, sessionExercisesa] = await Promise.all([
        api.api.sessionReadAll(),
        api.api.exerciseReadAll(),
        api.api.sessionExerciseReadAll(),
    ]);

    sessions.set(sessionsa.data);
    exercises.set(exercisesa.data);
    sessionExercises.set(sessionExercisesa.data);

    const storedValue = localStorage.getItem("sessionId");
    const initialValue = storedValue ? Number(storedValue) : null;
    sessionId.set(initialValue);
    sessionId.subscribe((value) => {
        if (value !== null) {
            localStorage.setItem("sessionId", String(value));
        } else {
            localStorage.removeItem("sessionId");
        }
    });
}
