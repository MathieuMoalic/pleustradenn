<script lang="ts">
    import { items } from "$lib/store";
    import { List } from "flowbite-svelte";
    import ItemComp from "$components/Item.svelte";
</script>

<main>
    <List tag="ul" class="space-y-1 text-gray-500">
        {#each $items as item}
            {#if !item.is_active}
                <ItemComp {item} />
            {/if}
        {/each}
    </List>
</main>
