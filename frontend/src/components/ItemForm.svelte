<script lang="ts">
    import { addAlert } from "$lib/alert";
    import { items, itemForm, categories } from "$lib/store";
    import { possibleUnits } from "$lib/types";
    import { Button, Modal, Label, Input, Spinner } from "flowbite-svelte";
    import CategoryForm from "./CategoryForm.svelte";
    import { api } from "$lib/auth";

    let loading = false;
    async function submitItem() {
        if ($itemForm.mode == "edit") {
            loading = true;
            let res = await api.itemUpdate($itemForm.itemID, $itemForm.item);
            if (!res.ok) {
                addAlert(
                    `Failed to update the item '${$itemForm.item.name}':${res.error}`,
                    "error",
                );
                loading = false;
                return;
            } else {
                let item = res.data;
                for (let i = 0; i < $items.length; i++) {
                    if ($items[i].id == item.id) {
                        $items[i] = item;
                        break;
                    }
                }
                $itemForm.isOpen = false;
                $itemForm.itemID = -1;
                addAlert($itemForm.item.name + " updated", "success");
            }
            loading = false;
            return;
        } else if ($itemForm.mode == "add") {
            if (!$itemForm.item.name) {
                addAlert("Name is required", "error");
                return;
            }
            if (!$itemForm.item.category_id) {
                addAlert("Category is required", "error");
                return;
            }
            loading = true;
            let res = await api.itemCreate({
                name: $itemForm.item.name,
                notes: $itemForm.item.notes,
                quantity: $itemForm.item.quantity,
                unit: $itemForm.item.unit,
                category_id: $itemForm.item.category_id,
            });
            if (!res.ok) {
                addAlert(
                    `Failed to update the item '${$itemForm.item.name}':${res.error}`,
                    "error",
                );
                loading = false;
                return;
            } else {
                items.update((items) => [...items, res.data]);
                $itemForm.isOpen = false;
                addAlert($itemForm.item.name + " created", "success");
            }
        } else {
            addAlert(`Invalid mode: ${$itemForm.mode}`, "error");
        }
        loading = false;
    }

    async function deleteItem() {
        let res = await api.itemDelete($itemForm.itemID);
        if (!res.ok) {
            addAlert(
                `Failed to delete the item '${$itemForm.item.name}':${res.error}`,
                "error",
            );
            return;
        } else {
            items.update((items) =>
                items.filter((item) => item.id != $itemForm.itemID),
            );
            $itemForm.isOpen = false;
            $itemForm.itemID = -1;
            addAlert(`"${$itemForm.item.name}" deleted`, "success");
        }
    }
</script>

<Modal
    bind:open={$itemForm.isOpen}
    size="xs"
    outsideclose
    class="bg-primaryBg text-primaryText rounded-lg"
>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
        class="flex flex-col space-y-4 p-3 rounded-lg shadow-lg bg-primaryBg text-primaryText"
        role="dialog"
        on:click={(e) => e.stopPropagation()}
    >
        <h3 class="text-lg font-semibold text-primaryText">
            {#if $itemForm.mode == "edit"}
                Edit Item
            {:else}
                Add a New Item
            {/if}
        </h3>

        <Label class="space-y-1 text-sm text-primaryText">
            <span>Name</span>
            <Input
                type="text"
                name="name"
                bind:value={$itemForm.item.name}
                class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                placeholder="Enter a name"
                required
            />
        </Label>

        <Label class="space-y-1 text-sm text-primaryText">
            <span>Quantity</span>
            <Input
                type="number"
                name="quantity"
                bind:value={$itemForm.item.quantity}
                class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                placeholder="Enter quantity"
            />
        </Label>

        <div>
            <span class="block text-sm font-medium text-primaryText">Unit</span>
            <div class="m-1 grid grid-cols-4 gap-1">
                {#each possibleUnits as choice}
                    <label
                        class={`inline-flex items-center justify-center p-1 cursor-pointer rounded-md
                         text-primaryText ${choice == $itemForm.item.unit ? "bg-buttonBg" : "bg-secondaryBg"}`}
                    >
                        <input
                            type="radio"
                            value={choice}
                            on:click={() => ($itemForm.item.unit = choice)}
                            name="unit"
                            class="hidden"
                        />
                        {choice}
                    </label>
                {/each}
            </div>
        </div>

        <div>
            <span class="block text-sm font-medium text-primaryText"
                >Category</span
            >
            <div class="m-1 grid grid-cols-3 gap-1">
                {#each $categories as category}
                    <label
                        class={`inline-flex items-center justify-center p-1 cursor-pointer rounded-md
                         text-primaryText ${
                             category.id == $itemForm.item.category_id
                                 ? "bg-buttonBg"
                                 : "bg-secondaryBg"
                         }`}
                    >
                        <input
                            type="radio"
                            value={category}
                            on:click={() =>
                                ($itemForm.item.category_id = category.id)}
                            name="category"
                            class="hidden"
                        />
                        {category.name}
                    </label>
                {/each}
                <label
                    class="inline-flex items-center justify-center p-1 cursor-pointer rounded-md bg-secondaryBg
                        text-primaryText"
                >
                    <CategoryForm />
                </label>
            </div>
        </div>

        <Label class="space-y-1 text-sm text-primaryText">
            <span>Notes</span>
            <Input
                type="text"
                name="notes"
                bind:value={$itemForm.item.notes}
                class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                placeholder="Enter notes"
            />
        </Label>

        <Button
            type="submit"
            class="w-full py-2 bg-buttonBg text-primaryText font-semibold rounded-md"
            on:click={submitItem}
        >
            {#if loading}
                <Spinner class="h-6" />
            {:else if $itemForm.mode == "edit"}
                Save
            {:else}
                Add Item
            {/if}
        </Button>

        {#if $itemForm.mode == "edit"}
            <Button
                type="button"
                class="w-full py-2 bg-red-600 hover:bg-red-700 text-primaryText font-semibold rounded-md"
                on:click={deleteItem}
            >
                Delete
            </Button>
        {/if}
    </div>
</Modal>
