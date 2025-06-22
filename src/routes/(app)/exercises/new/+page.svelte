<script lang="ts">
    import Menu from "$components/Navbar.svelte";
    import { t } from "$lib/stores/i18n";
    import type { ActionData } from "./$types";
    import ExerciseForm from "../ExerciseForm.svelte";

    export let form: ActionData;
    let ex = {
        id: -1,
        category: "other",
        intensity_unit: "kg",
        name: "",
        name_pl: "",
        name_fr: "",
        notes: "",
    };
</script>

<Menu name={$t("new_exercise")} />

<ExerciseForm {form} {ex} />
