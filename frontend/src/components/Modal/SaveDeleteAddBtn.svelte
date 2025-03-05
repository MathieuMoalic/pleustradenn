<script lang="ts">
    import { Button } from "flowbite-svelte";
    import { activePageState as aps } from "$lib/page";

    export let update = () => {};
    export let remove = () => {};
    export let create = () => {};
</script>

{#if $aps.modal.mode == "edit"}
    <Button type="submit" class="btn-edit" on:click={update}>Save</Button>
    <Button type="button" class="btn-delete" on:click={remove}>Delete</Button>
{:else}
    <Button type="submit" class="btn-edit" on:click={create}>
        Add Exercise
    </Button>
{/if}
