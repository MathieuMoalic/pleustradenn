<script lang="ts">
    import ExerciseForm from "$components/ExerciseForm.svelte";

    const ex = {
        name: "",
        notes: "",
        recommended_sets: "",
        recommended_reps_min: "",
        recommended_reps_max: "",
        recommended_rest_seconds: "",
    };
</script>

<ExerciseForm {ex} />
