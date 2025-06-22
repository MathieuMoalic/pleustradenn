<script lang="ts">
    import Menu from "$components/Navbar.svelte";
    import { t } from "$lib/stores/i18n";
    import ExerciseForm from "../ExerciseForm.svelte";
</script>

<Menu name={$t("new_exercise")} />

<ExerciseForm />
