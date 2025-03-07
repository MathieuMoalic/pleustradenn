<script lang="ts">
    import { Modal, Label, Input } from "flowbite-svelte";
    import SaveDeleteAddBtn from "$components/Modal/SaveDeleteAddBtn.svelte";
    import { update, remove, create } from "$lib/exercise";
    import { activePageState as aps } from "$lib/page";
    import Header from "$components/Modal/Header.svelte";
</script>

{#if $aps.page === "exercise"}
    <Modal bind:open={$aps.modal.open} size="xs" outsideclose class="modal">
        <Header name="Exercise" />

        <Label class="space-y-1 text-sm">
            <span>Name</span>
            <Input
                type="text"
                name="name"
                bind:value={$aps.modal.data.name}
                class="modal-input"
                placeholder="Enter a name"
                required
            />
        </Label>

        <Label class="space-y-1 text-sm">
            <span>Notes</span>
            <Input
                name="notes"
                bind:value={$aps.modal.data.notes}
                class="modal-input"
                placeholder="Enter notes"
            />
        </Label>

        <Label class="space-y-1 text-sm">
            <span>Category</span>
            <Input
                name="notes"
                bind:value={$aps.modal.data.category}
                class="modal-input"
                placeholder="Enter notes"
            />
        </Label>

        <Label class="space-y-1 text-sm">
            <span>Recommended Sets</span>
            <Input
                name="notes"
                bind:value={$aps.modal.data.recommended_sets}
                class="modal-input"
                placeholder="Enter notes"
            />
        </Label>

        <Label class="space-y-1 text-sm">
            <span>Recommended reps min</span>
            <Input
                name="notes"
                bind:value={$aps.modal.data.recommended_reps_min}
                class="modal-input"
                placeholder="Enter notes"
            />
        </Label>

        <Label class="space-y-1 text-sm">
            <span>Recommended reps max</span>
            <Input
                name="notes"
                bind:value={$aps.modal.data.recommended_reps_max}
                class="modal-input"
                placeholder="Enter notes"
            />
        </Label>

        <Label class="space-y-1 text-sm">
            <span>Recommended rest in seconds</span>
            <Input
                name="notes"
                bind:value={$aps.modal.data.recommended_rest_seconds}
                class="modal-input"
                placeholder="Enter notes"
            />
        </Label>

        <SaveDeleteAddBtn {update} {remove} {create} />
    </Modal>
{/if}
