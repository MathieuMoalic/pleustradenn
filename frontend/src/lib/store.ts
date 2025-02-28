import { writable } from "svelte/store";
import { type SessionExerciseRead, type ExerciseRead, type SessionReadBasic } from "./Api";
import type { exerciseModalState, sessionModalState, sessionExerciseModalState } from "./types";

export const sessions = writable<SessionReadBasic[]>([]);
export const exercises = writable<ExerciseRead[]>([]);
export const sessionExercises = writable<SessionExerciseRead[]>([]);
export const sessionId = writable<number | null>(null);

export const exerciseModal = writable<exerciseModalState>({
    isOpen: false,
    exercise: { name: "", notes: "" },
    mode: "add",
    exerciseID: -1,
});

export const sessionModal = writable<sessionModalState>({
    isOpen: false,
    session: { date: "", notes: "" },
    sessionID: -1,
    selectedDate: new Date(),
    mode: "add",
});

export const sessionExerciseModal = writable<sessionExerciseModalState>({
    isOpen: false,
    sessionExercise: { session_id: -1, exercise_id: -1, sets: 0, reps: 0, weight: 0, rest_seconds: 0, count: 0, },
    sessionExerciseID: -1,
    mode: "add",
});