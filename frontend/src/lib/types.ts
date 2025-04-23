import type { Exercise, SessionExercise } from '@prisma/client';

export type LoadedExercise = SessionExercise & { exercise: Exercise };

export type CreateSessionFormData = {
    user_id: number;
    date?: Date;
    notes?: string;
};