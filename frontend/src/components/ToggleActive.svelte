<script lang="ts">
    import { addAlert } from "$lib/alert";
    import { items, searchTerm } from "$lib/store";

    import type { ItemRead } from "$lib/Api";
    import { CloseOutline, PlusOutline } from "flowbite-svelte-icons";
    import { api } from "$lib/auth";
    import { Spinner } from "flowbite-svelte";

    export let item: ItemRead;

    let loading = false;

    async function toggleActive() {
        loading = true;
        searchTerm.set("");
        api.itemUpdate(item.id, { is_active: !item.is_active })
            .then((_) => {
                for (let i = 0; i < $items.length; i++) {
                    if ($items[i].id === item.id) {
                        $items[i].is_active = item.is_active;
                    }
                }
                addAlert(
                    `${item.name} ${item.is_active ? "removed" : "added"}`,
                    "success",
                );
                item.is_active = !item.is_active;
                // update the Li class manually
                const li = document.getElementById(" " + item.id);
                if (li) {
                    li.className = `m-2 flex justify-between items-center ${
                        item.is_active ? "text-gray-50" : "text-gray-500"
                    }`;
                }
            })
            .catch((res) => {
                addAlert(
                    res.error.detail || "Failed to toggle the active status",
                    "error",
                );
            })
            .finally(() => {
                loading = false;
            });
    }
</script>

{#if loading}
    <Spinner class="h-6" />
{:else}
    <div class="mr-3 mt-1.5">
        <button on:click={toggleActive}>
            {#if item.is_active}
                <CloseOutline />
            {:else}
                <PlusOutline />
            {/if}
        </button>
    </div>
{/if}
