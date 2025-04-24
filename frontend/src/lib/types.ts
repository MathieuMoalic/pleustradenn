import type {
    Exercise,
    ExerciseCategory,
} from "@prisma/client";

export type SessionExerciseFormData = {
    id: number | undefined;
    notes: string;
    session_id: number;
    exercise_id: number;
    sets: number;
    reps: number;
    weight: number;
    rest_seconds: number;
    count: number;
    completed: boolean;
    created_at: Date;
    success: boolean;
    exercise: Exercise;
}

export type CreateSessionFormData = {
    date?: Date;
    notes?: string;
};

export type ExerciseFormData = {
    name: string;
    notes: string;
    category: ExerciseCategory;
};
