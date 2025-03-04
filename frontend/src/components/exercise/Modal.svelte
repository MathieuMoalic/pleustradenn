<script lang="ts">
    import { Button, Modal, Label, Input } from "flowbite-svelte";
    import { submitExercise, removeExercise } from "$lib/exercise";
    import { activePageState as aps } from "$lib/page";
</script>

{#if $aps.page === "exercise"}
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
                    Edit Exercise
                {:else}
                    Add a New Exercise
                {/if}
            </h3>

            <Label class="space-y-1 text-sm text-primaryText">
                <span>Name</span>
                <Input
                    type="text"
                    name="name"
                    bind:value={$aps.modal.data.name}
                    class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                    placeholder="Enter a name"
                    required
                />
            </Label>

            <Label class="space-y-1 text-sm text-primaryText">
                <span>Notes</span>
                <Input
                    name="notes"
                    bind:value={$aps.modal.data.notes}
                    class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                    placeholder="Enter notes"
                />
            </Label>

            <Button
                type="submit"
                class="w-full py-2 bg-burnt-umber text-primaryText font-semibold rounded-md"
                on:click={submitExercise}
            >
                {#if $aps.modal.mode == "edit"}
                    Save
                {:else}
                    Add Exercise
                {/if}
            </Button>

            {#if $aps.modal.mode == "edit"}
                <Button
                    type="button"
                    class="w-full py-2 bg-red-600 hover:bg-red-700 text-primaryText font-semibold rounded-md"
                    on:click={removeExercise}
                >
                    Delete
                </Button>
            {/if}
        </div>
    </Modal>
{/if}
