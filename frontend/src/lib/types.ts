import type { ExerciseCreate, ExerciseUpdate } from "$lib/Api";

export interface exerciseModalState {
    isOpen: boolean;
    exercise: ExerciseCreate | ExerciseUpdate;
    exerciseID: number;
    mode: "edit" | "add";
} 