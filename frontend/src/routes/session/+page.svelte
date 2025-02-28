<script lang="ts">
    import Modal from "$components/sessionExercise/Modal.svelte";
    import List from "$components/sessionExercise/List.svelte";
    import Add from "$components/sessionExercise/Add.svelte";
    import { SEModal } from "$lib/store";
</script>

<main class="p-4">
    {#if $SEModal.isOpen}
        <Modal />
    {/if}
    <Add />
    <List />
</main>
