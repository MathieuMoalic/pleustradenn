<script lang="ts">
    import SessionExerciseForm from "$components/SessionExerciseForm.svelte";
    import type { LoadedExercise } from "$lib/types";
    import type { Exercise } from "@prisma/client";

    type PageData = {
        sessionExercise: LoadedExercise;
        exercises: Exercise[];
    };

    export let data: PageData;
    let sessionExercise: LoadedExercise = data.sessionExercise;
    let exercises: Exercise[] = data.exercises;
</script>

<SessionExerciseForm {exercises} {sessionExercise} />
