<script>
    import { Button, Dropdown, DropdownItem, Avatar } from "flowbite-svelte";
    import { ChevronDownOutline } from "flowbite-svelte-icons";
    import { exercises, SEModal } from "$lib/store";
    let dropdownOpen = false;
</script>

<Button class="border bg-white border-black rounded-md text-black w-full">
    {$SEModal.exercise_name}
    <ChevronDownOutline class="w-6 h-6 ms-2 text-white " />
</Button>
<Dropdown class="w-48 overflow-y-auto py-1 h-48" bind:open={dropdownOpen}>
    {#each $exercises as exercise}
        <DropdownItem
            class="flex items-center text-base font-semibold gap-2"
            on:click={() => {
                $SEModal.exercise_id = exercise.id;
                $SEModal.exercise_name = exercise.name;
                dropdownOpen = false;
            }}
        >
            {exercise.name}
        </DropdownItem>
    {/each}
    <a
        slot="footer"
        href="/"
        class="flex items-center px-3 py-2 -mb-1 text-sm font-medium text-primary-600 bg-gray-50 pt-2"
    >
        <ChevronDownOutline class="w-6 h-6 ms-2 text-white " />
        Add new exercise
    </a>
</Dropdown>
