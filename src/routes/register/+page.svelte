<script lang="ts">
    import AuthForm from "$components/AuthForm.svelte";
    import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<AuthForm {form} mode="register" />
