import { writable } from "svelte/store";
import { type ExerciseRead, type SessionReadBasic } from "./Api";
import type { exerciseModalState, sessionModalState, SEModalState } from "./types";

export const sessions = writable<SessionReadBasic[]>([]);
export const exercises = writable<ExerciseRead[]>([]);
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

export const SEModal = writable<SEModalState>({
    isOpen: false,
    mode: "add",
    id: -1,
    session_id: -1,
    exercise_id: -1,
    sets: 0,
    reps: 0,
    weight: 0,
    rest_seconds: 0,
    count: 0,
    exercise_name: "",
});