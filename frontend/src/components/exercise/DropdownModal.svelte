<script lang="ts">
    import { Button, Dropdown, DropdownItem, Label } from "flowbite-svelte";
    import { ChevronDownOutline } from "flowbite-svelte-icons";
    import { activePageState as aps } from "$lib/page";
    import { ExerciseCategory } from "$lib/api";
    let dropdownOpen = false;

    function onclick(cat: ExerciseCategory) {
        if ($aps.page !== "exercise") return;
        $aps.modal.data.category = cat;
        dropdownOpen = false;
    }

    let categories = Object.values(ExerciseCategory);
</script>

<!-- This is to make ts happy, this modal will only show if it is a sessionExercise anyway -->
{#if $aps.page === "exercise"}
    <Label class="space-y-1 text-sm">
        <span class="font-medium">Category</span>
        <div class="flex items-center space-x-3">
            <Button
                class="border modal-input h-10 rounded-md bg-white  justify-between w-full text-left text-black pl-2"
            >
                {$aps.modal.data.category}
                <ChevronDownOutline class="w-6 h-6 ms-2 text-black" />
            </Button>
            <Dropdown
                class="overflow-y-auto rounded-md bg-thistle divide-y divide-gray-200"
                bind:open={dropdownOpen}
            >
                {#each categories as category}
                    <DropdownItem
                        class="text-base w-64 "
                        on:click={() => onclick(category)}
                    >
                        {category}
                    </DropdownItem>
                {/each}
            </Dropdown>
        </div>
    </Label>
{/if}
