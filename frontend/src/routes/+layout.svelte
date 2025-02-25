<script lang="ts">
    import "../app.css";
    import Navbar from "../components/Navbar.svelte";
</script>

<!-- min-h-screen ensures the container fills at least the full viewport height -->
<div class="min-h-screen bg-gray-700 flex flex-col">
    <Navbar />
    <!-- flex-grow ensures this inner area expands to fill remaining vertical space -->
    <div class="max-w-[500px] mx-auto font-['Segoe_UI',sans-serif] flex-grow">
        <slot></slot>
    </div>
</div>
