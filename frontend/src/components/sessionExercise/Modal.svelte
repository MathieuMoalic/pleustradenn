<script lang="ts">
    import { Button, Modal, Label, Input } from "flowbite-svelte";
    import Dropdown from "$components/sessionExercise/Dropdown.svelte";
    import {
        removeSessionExercise,
        submitSessionExercise,
    } from "$lib/session-exercise";
    import { activePageState as aps } from "$lib/page";
</script>

{#if $aps.page === "sessionExercise"}
    <Modal
        bind:open={$aps.modal.open}
        size="xs"
        outsideclose
        class="bg-plum text-primaryText rounded-lg"
    >
        <div
            class="flex flex-col space-y-4 p-3 rounded-lg shadow-lg bg-primaryBg text-primaryText"
            role="dialog"
        >
            <h3 class="text-lg font-semibold text-primaryText">
                {#if $aps.modal.mode == "edit"}
                    Edit Session Exercise
                {:else}
                    Add a New Session Exercise
                {/if}
            </h3>
            <Label class="space-y-1 text-sm text-primaryText">
                <span>Exercise</span>
                <Dropdown />
            </Label>

            <Label class="space-y-1 text-sm text-primaryText">
                <span>Sets</span>
                <Input
                    type="number"
                    name="sets"
                    class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                    placeholder="Enter the number of sets"
                    required
                    bind:value={$aps.modal.data.sets}
                />
            </Label>

            <Label class="space-y-1 text-sm text-primaryText">
                <span>Reps</span>
                <Input
                    type="number"
                    name="reps"
                    class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                    placeholder="Enter the number of reps"
                    required
                    bind:value={$aps.modal.data.reps}
                />
            </Label>

            <Label class="space-y-1 text-sm text-primaryText">
                <span>Weight</span>
                <Input
                    type="number"
                    name="weight"
                    class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                    placeholder="Enter the weight"
                    required
                    bind:value={$aps.modal.data.weight}
                />
            </Label>

            <Label class="space-y-1 text-sm text-primaryText">
                <span>Rest Seconds</span>
                <Input
                    type="number"
                    name="rest_seconds"
                    class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                    placeholder="Enter the rest seconds"
                    required
                    bind:value={$aps.modal.data.rest_seconds}
                />
            </Label>

            <Label class="space-y-1 text-sm text-primaryText">
                <span>Count</span>
                <Input
                    type="number"
                    name="count"
                    class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                    placeholder="Enter the count"
                    required
                    bind:value={$aps.modal.data.count}
                />
            </Label>

            <Button
                type="submit"
                class="w-full py-2 bg-burnt-umber text-primaryText font-semibold rounded-md"
                on:click={submitSessionExercise}
            >
                {#if $aps.modal.mode == "edit"}
                    Save
                {:else}
                    Add Session Exercise
                {/if}
            </Button>

            {#if $aps.modal.mode == "edit"}
                <Button
                    type="button"
                    class="w-full py-2 bg-red-600 hover:bg-red-700 text-primaryText font-semibold rounded-md"
                    on:click={removeSessionExercise}
                >
                    Delete
                </Button>
            {/if}
        </div>
    </Modal>
{/if}
