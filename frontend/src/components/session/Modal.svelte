<script lang="ts">
    import { Button, Modal, Label, Input, Datepicker } from "flowbite-svelte";
    import { activePageState as aps } from "$lib/page";
    import { submitSession, removeSession } from "$lib/session";
</script>

<!-- This is to make ts happy, this modal will only show if it is a session anyway -->
{#if $aps.page === "session"}
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
                    Edit Session
                {:else}
                    Add a New Session
                {/if}
            </h3>

            <div class="mb-64 md:w-1/2">
                <Datepicker
                    bind:value={$aps.data.selectedDate}
                    inline
                    color="red"
                />
            </div>

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
                on:click={submitSession}
            >
                {#if $aps.modal.mode == "edit"}
                    Save
                {:else}
                    Add Session
                {/if}
            </Button>

            {#if $aps.modal.mode == "edit"}
                <Button
                    type="button"
                    class="w-full py-2 bg-red-600 hover:bg-red-700 text-primaryText font-semibold rounded-md"
                    on:click={removeSession}
                >
                    Delete
                </Button>
            {/if}
        </div>
    </Modal>
{/if}
