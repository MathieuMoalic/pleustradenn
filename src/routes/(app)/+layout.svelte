<script lang="ts">
    import Navbar from "$components/Navbar.svelte";
</script>

<main class="min-h-screen bg-seal-brown pt-3">
    <Navbar />
    <section class="font-['Segoe_UI',sans-serif] p-4">
        <slot />
    </section>
</main>
