<script lang="ts">
    import { Input, Button, Dropdown, DropdownItem } from "flowbite-svelte";
    import { ChevronDownOutline } from "flowbite-svelte-icons";
    import { page } from "$app/state";
    import type { ExerciseCategory } from "@prisma/client";
    export let form_data: {
        name: string;
        notes: string;
        category: ExerciseCategory;
    };
    export let categories: ExerciseCategory[] = [];
    let selected_category: ExerciseCategory = categories[0];
    let dropdownOpen = false;

    function select_category(c: ExerciseCategory) {
        dropdownOpen = false;
        selected_category = c;
    }
</script>

<form method="POST" class="space-y-5 text-white">
    <label>
        <span>Name</span>
        <Input name="name" bind:value={form_data.name} required />
    </label>

    <label>
        <span>Notes</span>
        <Input name="notes" bind:value={form_data.notes} />
    </label>

    <label>
        <span>Category</span>
        <input type="hidden" name="category_id" value={selected_category.id} />
        <Button class="w-full bg-white text-black mt-1">
            {selected_category.name}
            <ChevronDownOutline
                class="w-6 h-6 ms-2 text-white dark:text-white"
            />
        </Button>
        <Dropdown bind:open={dropdownOpen}>
            {#each categories as c}
                <DropdownItem on:click={() => select_category(c)}
                    >{c.name}</DropdownItem
                >
            {/each}
        </Dropdown>
    </label>

    <div class="flex justify-between gap-2 pt-4">
        {#if page.params.id}
            <Button type="submit" formaction="?/update" class="btn-edit w-full"
                >Save</Button
            >
            <Button
                type="submit"
                class="btn-delete w-full"
                formaction="?/delete"
                formmethod="POST"
            >
                Delete
            </Button>
        {:else}
            <Button type="submit" formaction="?/create" class="btn-edit w-full">
                Add {form_data.name}
            </Button>
        {/if}
    </div>
</form>
