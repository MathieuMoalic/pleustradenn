<script lang="ts">
    import { Modal, Label, Input, Datepicker } from "flowbite-svelte";
    import { activePageState as aps } from "$lib/page";
    import { create, update, remove } from "$lib/session";
    import SaveDeleteAddBtn from "$components/Modal/SaveDeleteAddBtn.svelte";
    import Header from "$components/Modal/Header.svelte";
</script>

<!-- This is to make ts happy, this modal will only show if it is a session anyway -->
{#if $aps.page === "session"}
    <Modal bind:open={$aps.modal.open} size="xs" outsideclose class="modal">
        <Header name="Session" />

        <div class="mb-64 md:w-1/2">
            <Datepicker
                bind:value={$aps.data.selectedDate}
                inline
                color="red"
            />
        </div>

        <Label class="space-y-1 text-sm">
            <span>Notes</span>
            <Input
                name="notes"
                bind:value={$aps.modal.data.notes}
                class="modal-input"
                placeholder="Enter notes"
            />
        </Label>

        <SaveDeleteAddBtn {update} {remove} {create} />
    </Modal>
{/if}
