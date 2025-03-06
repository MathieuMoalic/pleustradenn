import { writable } from "svelte/store";
import type { SessionExerciseRead, SessionReadDetailed, ExerciseRead } from "$lib/api";

export type PageState =
    | {
        page: "session";
        modal: {
            open: boolean;
            mode: "add" | "edit";
            data: SessionReadDetailed;
        };
        data: {
            selectedDate: Date;
        };
    }
    | {
        page: "exercise";
        modal: {
            open: boolean;
            mode: "add" | "edit";
            data: ExerciseRead;
        };
        data: {};
    }
    | {
        page: "sessionExercise";
        modal: {
            open: boolean;
            mode: "add" | "edit";
            data: SessionExerciseRead;
        };
        data: {
            sessionID: number;
            exercise: ExerciseRead | null;
        };
    }
    | {
        page: "login";
        modal: {
            open: false;
            mode: "add" | "edit";
            data: null;
        };
        data: null;
    };

// Function to load the state from localStorage
function loadState(): PageState {
    if (typeof localStorage !== "undefined") {
        const stored = localStorage.getItem("activePageState");
        let ps = stored ? JSON.parse(stored) : { page: "session", id: -1, modal_open: false, modal_mode: "add", modal_data: null };
        if (ps.page === "session" && ps.data && ps.data.selectedDate) {
            ps.data.selectedDate = new Date(ps.data.selectedDate);
        }
        return ps;
    }
    return {
        page: "session",
        data: { selectedDate: new Date() },
        modal: { open: false, mode: "add", data: { date: "", notes: "", id: -1, session_exercises: [] } },
    }
}

// Create a writable store with the initial state
export const activePageState = writable<PageState>(loadState());

// Subscribe to store changes and save to localStorage
activePageState.subscribe((value) => {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("activePageState", JSON.stringify(value));
    }
});

export function goto(page: "session" | "exercise" | "sessionExercise" | "login") {
    activePageState.update((state) => {
        if (page === "session") {
            return {
                page,
                data: { selectedDate: new Date() },
                modal: { open: false, mode: "add", data: { date: "", notes: "", id: -1, session_exercises: [] } }
            };
        }
        if (page === "exercise") {
            return {
                page,
                data: { sessionID: -1, selectedDate: new Date() },
                modal: {
                    open: false, mode: "add", data: {
                        id: -1, name: "", description: "", notes: "", recommended_reps_max: 0,
                        recommended_reps_min: 0,
                        recommended_sets: 0,
                        recommended_rest_seconds: 0,

                    }
                }
            };
        }
        if (page === "sessionExercise") {
            return {
                page,
                data: { sessionID: -1, exercise: null },
                modal: {
                    open: false, mode: "add", data: {
                        sets: 0,
                        reps: 0,
                        weight: 0,
                        session_id: -1,
                        exercise_id: -1,
                        rest_seconds: 0,
                        count: 0,
                        exercise_name: "",
                        id: -1,
                        completed: false,
                        created_at: "",
                    }
                }
            };
        }
        if (page === "login") {
            localStorage.removeItem("token");
            return {
                page,
                data: null,
                modal: { open: false, mode: "add", data: null }
            };
        }
        return state; // Fallback in case an invalid page is somehow passed
    });
}


export function closeModal() {
    activePageState.update((aps) => {
        aps.modal.open = false;
        return aps;
    }
    );
}