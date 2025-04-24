<script lang="ts">
    import PlusMinusInput from "$components/Modal/Input.svelte";
    import {
        Button,
        Dropdown,
        DropdownItem,
        Label,
        Input,
    } from "flowbite-svelte";
    import { ChevronDownOutline, EditOutline } from "flowbite-svelte-icons";
    import type { SessionExerciseFormData } from "$lib/types";
    import type { Exercise } from "@prisma/client";
    import { goto } from "$app/navigation";

    export let sessionExercise: SessionExerciseFormData;
    export let exercises: Exercise[];

    let dropdownOpen = false;
</script>

<form method="POST" class="space-y-4">
    <input type="hidden" name="session_id" value={sessionExercise.session_id} />
    <input
        type="hidden"
        name="exercise_id"
        value={sessionExercise.exercise_id}
    />
    <Label class="space-y-1 text-sm">
        <span class="font-medium">Exercise</span>
        <div class="flex items-center space-x-3">
            <Button
                class="border-burnt-umber border h-10 rounded-md bg-white w-full text-center text-black"
            >
                {sessionExercise.exercise.name}
                <ChevronDownOutline class="w-6 h-6 ms-2 text-white " />
            </Button>
            <Dropdown
                class="h-72 overflow-y-auto rounded-md"
                bind:open={dropdownOpen}
            >
                {#each exercises as exercise}
                    <DropdownItem
                        class="text-base w-64 bg-thistle"
                        on:click={() => {
                            sessionExercise.exercise = exercise;
                            dropdownOpen = false;
                        }}
                    >
                        {exercise.name}
                    </DropdownItem>
                {/each}
            </Dropdown>
            <button
                class="p-1.5 bg-burnt-umber rounded-md text-white"
                type="button"
                on:click={() =>
                    goto(`/exercises/${sessionExercise.exercise.id}/edit`)}
            >
                <EditOutline class="w-6 h-6" />
            </button>
        </div>
    </Label>

    <PlusMinusInput
        bind:value={sessionExercise.sets}
        label="Sets"
        name="sets"
    />
    <PlusMinusInput
        bind:value={sessionExercise.reps}
        label="Reps"
        name="reps"
    />
    <PlusMinusInput
        bind:value={sessionExercise.weight}
        label="Weight"
        name="weight"
    />
    <PlusMinusInput
        bind:value={sessionExercise.rest_seconds}
        label="Rest (s)"
        name="rest_seconds"
    />
    <PlusMinusInput
        bind:value={sessionExercise.count}
        label="Count"
        name="count"
    />
    <Label class="space-y-1 text-sm">
        <div class="flex items-center space-x-3">
            <span class="font-medium w-28 text-left flex-shrink-0">Notes</span>
            <Input
                name="notes"
                bind:value={sessionExercise.notes}
                class="modal-input"
                placeholder="Enter notes"
            />
        </div>
    </Label>

    <div class="flex justify-between gap-2 pt-4">
        {#if sessionExercise.id !== undefined}
            <Button type="submit" formaction="?/update" class="btn-edit w-full">
                Save
            </Button>
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
                Add {sessionExercise.notes}
            </Button>
        {/if}
    </div>
</form>
