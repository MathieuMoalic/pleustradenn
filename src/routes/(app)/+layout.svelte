<script lang="ts">
    import type { PageData } from "./$types";

    import { language } from "$lib/stores/i18n";
    import Alert from "$components/Alert.svelte";
    export let data: PageData;
    language.set(data.language);
</script>

<main
    class="min-h-screen bg-seal-brown bg-[url('/bg.avif')] bg-cover bg-center bg-fixed font-['Segoe_UI',sans-serif]"
>
    <Alert />
    <slot />
</main>
