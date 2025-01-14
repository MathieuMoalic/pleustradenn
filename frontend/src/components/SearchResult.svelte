<script lang="ts">
    import { itemForm, searchResults, searchTerm } from "$lib/store";
    import { Button, Li, List } from "flowbite-svelte";
    import ItemComp from "$components/Item.svelte";
    import { PlusOutline } from "flowbite-svelte-icons";

    function addItemForm() {
        $itemForm.mode = "add";
        $itemForm.item = {
            name: $searchTerm,
            quantity: null,
            unit: "None",
            category_id: 1, // Default to "Other"
            notes: "",
        };
        $itemForm.isOpen = true;
        $searchTerm = "";
    }
</script>

<main>
    <List tag="ul" class="space-y-1">
        <Li class="text-lg font-bold flex justify-center items-center" icon>
            <Button
                size="sm"
                class="bg-buttonBg w-full m-2 font-semibold"
                on:click={addItemForm}
            >
                <PlusOutline class="mr-3" />
                {$searchTerm}
            </Button>
        </Li>
        {#if $searchResults.length > 0}
            {#each $searchResults as item}
                <ItemComp {item} />
            {/each}
        {:else}
            No results found.
        {/if}
    </List>
</main>
