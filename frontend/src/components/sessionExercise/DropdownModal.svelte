<script lang="ts">
    import { Button, Dropdown, DropdownItem, Label } from "flowbite-svelte";
    import { ChevronDownOutline, EditOutline } from "flowbite-svelte-icons";
    import { exerciseList, openExerciseModal } from "$lib/exercise";
    import { activePageState as aps } from "$lib/page";
    import type { ExerciseRead } from "$lib/api";
    import { loadMostRecentExerciseData } from "$lib/session-exercise";
    let dropdownOpen = false;

    function onclick(ex: ExerciseRead) {
        if ($aps.page !== "sessionExercise") return;
        $aps.data.exercise = ex;
        $aps.modal.data.exercise_id = ex.id;
        $aps.modal.data.exercise_name = ex.name;
        loadMostRecentExerciseData(ex);
        dropdownOpen = false;
    }
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
                class="h-72 overflow-y-auto rounded-md"
                bind:open={dropdownOpen}
            >
                {#each $exerciseList as exercise}
                    <DropdownItem
                        class="text-base w-64 bg-thistle"
                        on:click={() => onclick(exercise)}
                    >
                        {exercise.name}
                    </DropdownItem>
                {/each}
            </Dropdown>
            <button
                class="p-1.5 bg-burnt-umber rounded-md text-white"
                on:click={() => openExerciseModal($aps.data.exercise)}
            >
                <EditOutline class="w-6 h-6" />
            </button>
        </div>
    </Label>
{/if}
