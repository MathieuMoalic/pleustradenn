import { writable } from "svelte/store";
import { type SessionExerciseRead, type ExerciseRead, type SessionRead } from "./Api";
import type { exerciseModalState } from "./types";

export const sessions = writable<SessionRead[]>([]);
export const exercises = writable<ExerciseRead[]>([]);
export const sessionExercises = writable<SessionExerciseRead[]>([]);
export const sessionId = writable<number | null>(null);

export const exerciseModal = writable<exerciseModalState>({
    isOpen: false,
    exercise: { name: "", notes: "" },
    mode: "add",
    exerciseID: -1,
});
