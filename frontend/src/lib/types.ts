import type { ExerciseCreate, ExerciseUpdate, SessionCreate, SessionUpdate, SessionExerciseCreate, SessionExerciseUpdate, SessionExerciseRead } from "$lib/Api";

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

export interface SEModalState extends SessionExerciseRead {
    isOpen: boolean;
    mode: "edit" | "add";
}