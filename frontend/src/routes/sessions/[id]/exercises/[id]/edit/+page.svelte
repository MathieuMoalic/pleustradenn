<script lang="ts">
    import SessionExerciseForm from "$components/SessionExerciseForm.svelte";
    import type { SessionExerciseFormData } from "$lib/types";
    import type { Exercise } from "@prisma/client";

    type PageData = {
        sessionExercise: SessionExerciseFormData;
        exercises: Exercise[];
    };

    export let data: PageData;
    let sessionExercise: SessionExerciseFormData = data.sessionExercise;
    let exercises: Exercise[] = data.exercises;
</script>

<SessionExerciseForm {exercises} {sessionExercise} />
