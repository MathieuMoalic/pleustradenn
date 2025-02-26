import { writable } from "svelte/store";
import { type SessionExerciseRead, type ExerciseRead, type SessionRead } from "./Api";

export const sessions = writable<SessionRead[]>([]);
export const exercises = writable<ExerciseRead[]>([]);
export const sessionExercises = writable<SessionExerciseRead[]>([]);
export const sessionId = writable<number | null>(null);