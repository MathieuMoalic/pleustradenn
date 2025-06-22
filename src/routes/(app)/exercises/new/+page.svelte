<script lang="ts">
    import Menu from "$components/Navbar.svelte";
    import { t } from "$lib/stores/i18n";
    import ExerciseForm from "../ExerciseForm.svelte";
    let ex = {
        id: -1,
        category: "other",
        intensity_unit: "kg",
        name: "",
        name_fr: null,
        name_pl: null,
        notes: "",
    };
</script>

<Menu name={$t("new_exercise")} />

<ExerciseForm {ex} />
