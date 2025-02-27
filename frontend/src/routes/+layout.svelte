<script lang="ts">
    import "../app.css";
    import Navbar from "../components/Navbar.svelte";
    import Alert from "$components/Alert.svelte";
</script>

<div class="min-h-screen bg-gray-700 flex flex-col">
    <Navbar />
    <Alert />
    <div class="font-['Segoe_UI',sans-serif] flex-grow">
        <slot></slot>
    </div>
</div>
