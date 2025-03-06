<script lang="ts">
    import { Modal } from "flowbite-svelte";
    import DropdownModal from "$components/sessionExercise/DropdownModal.svelte";
    import { create, remove, update } from "$lib/session-exercise";
    import { activePageState as aps } from "$lib/page";
    import Input from "$components/Modal/Input.svelte";
    import SaveDeleteAddBtn from "$components/Modal/SaveDeleteAddBtn.svelte";
    import Header from "$components/Modal/Header.svelte";
</script>

{#if $aps.page === "sessionExercise"}
    <Modal bind:open={$aps.modal.open} size="xs" outsideclose class="modal">
        <Header name="Session Exercise" />
        <DropdownModal />
        {#if $aps.data.exercise !== null}
            <Input
                bind:value={$aps.modal.data.sets}
                name={`Sets (${$aps.data.exercise?.recommended_sets})`}
            />
            <Input
                bind:value={$aps.modal.data.reps}
                name={`Reps (${$aps.data.exercise?.recommended_reps_min}-${$aps.data.exercise?.recommended_reps_max})`}
            />
            <Input bind:value={$aps.modal.data.weight} name="Weight" />
            <Input
                bind:value={$aps.modal.data.rest_seconds}
                name={`Rest (${$aps.data.exercise?.recommended_rest_seconds}s)`}
            />
            <Input bind:value={$aps.modal.data.count} name="Count" />

            <SaveDeleteAddBtn {update} {remove} {create} />
        {/if}
    </Modal>
{/if}
