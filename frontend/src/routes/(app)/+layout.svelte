<script lang="ts">
    import Alert from "$components/Alert.svelte";
    import Navbar from "$components/Navbar.svelte";
</script>

<Alert />
<main class="min-h-screen bg-seal-brown pt-3">
    <Navbar />
    <section class="font-['Segoe_UI',sans-serif] p-4">
        <slot />
    </section>
</main>
