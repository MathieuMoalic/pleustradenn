<script lang="ts">
    import Edit from "$components/icons/Edit.svelte";

    export let session_id: number;
    export let toggleExpand: (sessionId: number) => void;
</script>

<button
    type="button"
    class="flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
    on:click={() => {
        toggleExpand(session_id);
    }}
    aria-label="Edit session"
>
    <Edit />
</button>
