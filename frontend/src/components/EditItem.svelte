<script lang="ts">
    import { Button } from "flowbite-svelte";
    import { itemForm } from "$lib/store";
    import type { ItemRead } from "$lib/Api";
    import { EditOutline } from "flowbite-svelte-icons";

    export let item: ItemRead;
</script>

<Button
    size="sm"
    class="m-1 p-1 border-0"
    outline
    on:click={() => {
        $itemForm.mode = "edit";
        $itemForm.item = item;
        $itemForm.isOpen = true;
        $itemForm.itemID = item.id;
    }}
>
    <EditOutline size="md" />
</Button>
