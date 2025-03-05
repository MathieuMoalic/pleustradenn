<script lang="ts">
    import { activePageState as aps } from "$lib/page";
    export let name = "";
</script>

<h3 class="text-lg font-semibold">
    {#if $aps.modal.mode == "edit"}
        Edit {name}
    {:else}
        Add a New {name}
    {/if}
</h3>
