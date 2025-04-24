<script lang="ts">
    import ExerciseForm from "$components/ExerciseForm.svelte";
    export let data;
    const form_data = {
        name: "",
        notes: "",
        category: data.categories[0],
    };
</script>

<ExerciseForm {form_data} categories={data.categories} />
