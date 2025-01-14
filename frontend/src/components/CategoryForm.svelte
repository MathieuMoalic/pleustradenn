<script lang="ts">
    import { addAlert } from "$lib/alert";
    import { api } from "$lib/auth";
    import { categories, categoryFormOpen, items } from "$lib/store";

    import { Input, Modal } from "flowbite-svelte";
    import {
        BanOutline,
        CheckOutline,
        CloseOutline,
        EditOutline,
        PlusOutline,
    } from "flowbite-svelte-icons";

    let editCategory = "";
    let editCategoryInput = "";
    async function editCategoryName(id: number) {
        if (!editCategoryInput) return;

        api.categoryUpdate(id, { name: editCategoryInput })
            .then((res) => {
                categories.update((cats) =>
                    cats.map((cat) =>
                        cat.id === id ? { ...cat, name: res.data.name } : cat,
                    ),
                );
                editCategory = "";
                editCategoryInput = "";
                addAlert("Category edited", "success");
            })
            .catch((res) => {
                addAlert(
                    res.error.detail || "Failed to edit category",
                    "error",
                );
            });
    }

    let inputValue = "";
    async function addCategory() {
        if (!inputValue) return;

        api.categoryCreate({ name: inputValue })
            .then((res) => {
                categories.update((cats) => [...cats, res.data]);
                inputValue = "";
                addAlert("Category created", "success");
            })
            .catch((res) => {
                addAlert(
                    res.error.detail || "Failed to create category",
                    "error",
                );
            });
    }

    async function removeCategory(id: number) {
        if (id === 1) {
            addAlert("Cannot delete this category", "error");
            return;
        }
        api.categoryDelete(id)
            .then((_) => {
                categories.update((cats) =>
                    cats.filter((cat) => cat.id !== id),
                );
                addAlert("Category deleted", "success");
                // change the category of all the items that had this category to the default category using a for loop
                for (let i = 0; i < $items.length; i++) {
                    if ($items[i].category_id === id) {
                        $items[i].category_id = 1;
                    }
                }
            })
            .catch((res) => {
                addAlert(
                    res.error.detail || "Failed to delete category",
                    "error",
                );
            });
    }
</script>

<button on:click={() => ($categoryFormOpen = true)}>
    <EditOutline size="md" />
</button>

<Modal
    bind:open={$categoryFormOpen}
    size="xs"
    outsideclose
    class="bg-secondaryBg text-gray-100 rounded-lg"
>
    {#each $categories as category}
        {#if editCategory !== category.name}
            <div class="flex ml-2 bg-primaryBg rounded mr-12 p-2">
                <button
                    on:click={() => {
                        removeCategory(category.id);
                    }}
                >
                    <CloseOutline color="red" />
                </button>
                <div class="ml-3">
                    {category.name}
                </div>
                <div class="ml-auto">
                    <button
                        on:click={() => {
                            editCategory = category.name;
                            editCategoryInput = category.name;
                        }}
                    >
                        <EditOutline size="md" color="orange" />
                    </button>
                </div>
            </div>
        {:else}
            <div class="flex ml-2 bg-primaryBg rounded mr-12 p-2">
                <input
                    type="text"
                    class="bg-primaryBg border-inputBorderColor rounded-md primaryText w-full h-7"
                    bind:value={editCategoryInput}
                    on:keydown={(e) =>
                        e.key === "Enter" && editCategoryName(category.id)}
                />
                <button
                    class="w-2/12 flex justify-center items-center"
                    on:click={() => {
                        editCategory = "";
                        editCategoryInput = "";
                    }}
                >
                    <BanOutline color="red" />
                </button>
                <button
                    class="w-2/12 flex justify-center items-center"
                    on:click={() => {
                        editCategoryName(category.id);
                    }}
                >
                    <CheckOutline color="green" />
                </button>
            </div>
        {/if}
    {/each}
    <div class="flex">
        <Input
            placeholder="Add category"
            bind:value={inputValue}
            class="bg-primaryBg border-inputBorderColor rounded-md text-primaryText`"
            on:keydown={(e) => e.key === "Enter" && addCategory()}
        />
        <button on:click={addCategory}>
            <PlusOutline size="md" class="ml-2 self-center" />
        </button>
    </div>
</Modal>
