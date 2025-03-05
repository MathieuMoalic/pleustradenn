<script>
    import { Button, Dropdown, DropdownItem, Label } from "flowbite-svelte";
    import { ChevronDownOutline } from "flowbite-svelte-icons";
    import { exerciseList } from "$lib/exercise";
    import { activePageState as aps } from "$lib/page";
    let dropdownOpen = true;
</script>

<!-- This is to make ts happy, this modal will only show if it is a sessionExercise anyway -->
{#if $aps.page === "sessionExercise"}
    <Label class="space-y-1 text-sm">
        <span class="font-medium">Exercise</span>
        <div class="flex items-center space-x-3">
            <Button
                class="border-burnt-umber border h-10 rounded-md bg-white w-full text-center text-black"
            >
                {$aps.modal.data.exercise_name}
                <ChevronDownOutline class="w-6 h-6 ms-2 text-white " />
            </Button>
            <Dropdown
                class="w-full max-w-72 bg-white border border-gray-300 rounded-md shadow-md py-1 overflow-y-auto"
                bind:open={dropdownOpen}
            >
                {#each $exerciseList as exercise}
                    <DropdownItem
                        class="px-4 py-2 flex items-center text-base font-semibold gap-2 hover:bg-gray-100 cursor-pointer transition w-64"
                        on:click={() => {
                            $aps.modal.data.exercise_id = exercise.id;
                            $aps.modal.data.exercise_name = exercise.name;
                            dropdownOpen = false;
                        }}
                    >
                        {exercise.name}
                    </DropdownItem>
                {/each}
            </Dropdown>
        </div>
    </Label>
{/if}
