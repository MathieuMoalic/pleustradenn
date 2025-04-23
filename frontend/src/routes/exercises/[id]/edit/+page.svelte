<script lang="ts">
    import ExerciseForm from "$components/ExerciseForm.svelte";
    export let data;

    const ex = {
        name: data.exercise.name,
        notes: data.exercise.notes ?? "",
        recommended_sets: String(data.exercise.recommended_sets ?? ""),
        recommended_reps_min: String(data.exercise.recommended_reps_min ?? ""),
        recommended_reps_max: String(data.exercise.recommended_reps_max ?? ""),
        recommended_rest_seconds: String(
            data.exercise.recommended_rest_seconds ?? "",
        ),
    };
</script>

<ExerciseForm {ex} />
