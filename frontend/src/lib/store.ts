import { writable } from "svelte/store";
import { type SessionExerciseRead, type ExerciseRead, type SessionRead } from "./Api";

export const workouts = writable<SessionRead[]>([]);
export const exercises = writable<ExerciseRead[]>([]);
export const workoutExercises = writable<SessionExerciseRead[]>([]);
export const workoutId = writable<number | null>(null);