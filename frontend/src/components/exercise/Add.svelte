<script lang="ts">
    import { exerciseModal } from "$lib/store";
</script>

<button
    on:click={() => ($exerciseModal.isOpen = true)}
    class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition duration-200"
>
    ➕ Add Exercise
</button>
