import type { ExerciseCreate, ExerciseUpdate, SessionCreate, SessionUpdate, SessionExerciseCreate, SessionExerciseUpdate } from "$lib/Api";

export interface exerciseModalState {
    isOpen: boolean;
    exercise: ExerciseCreate | ExerciseUpdate;
    exerciseID: number;
    mode: "edit" | "add";
}

export interface sessionModalState {
    isOpen: boolean;
    session: SessionCreate | SessionUpdate;
    sessionID: number;
    selectedDate: Date;
    mode: "edit" | "add";
}

export interface sessionExerciseModalState {
    isOpen: boolean;
    sessionExercise: SessionExerciseCreate | SessionExerciseUpdate;
    sessionExerciseID: number;
    mode: "edit" | "add";
}