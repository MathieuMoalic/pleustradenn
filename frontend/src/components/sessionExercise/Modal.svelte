<script lang="ts">
    import { Button, Modal } from "flowbite-svelte";
    import DropdownModal from "$components/sessionExercise/DropdownModal.svelte";
    import {
        create,
        loadMostRecentExerciseData,
        remove,
        update,
    } from "$lib/session-exercise";
    import { activePageState as aps } from "$lib/page";
    import Input from "$components/Modal/Input.svelte";
    import SaveDeleteAddBtn from "$components/Modal/SaveDeleteAddBtn.svelte";
    import { ExerciseCategory, type ExerciseRead } from "$lib/api";
    import { exerciseList } from "$lib/exercise";
    let filter: ExerciseCategory = ExerciseCategory.Core;

    function onclick(ex: ExerciseRead) {
        if ($aps.page !== "sessionExercise") return;
        $aps.data.exercise = ex;
        $aps.modal.data.exercise_id = ex.id;
        $aps.modal.data.exercise_name = ex.name;
        loadMostRecentExerciseData(ex);
    }
</script>

{#if $aps.page === "sessionExercise"}
    <Modal
        bind:open={$aps.modal.open}
        size="xs"
        outsideclose
        class="modal h-[90vh]"
    >
        {#if $aps.data.exercise === null}
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Filter</h2>

            <div class="flex flex-wrap gap-2 mb-4">
                {#each Object.values(ExerciseCategory) as cat}
                    <Button
                        class="px-4 py-2 text-sm rounded-md {filter === cat
                            ? 'bg-seal-brown'
                            : 'bg-burnt-umber'}"
                        outline={filter !== cat}
                        on:click={() => (filter = cat)}
                    >
                        {cat}
                    </Button>
                {/each}
            </div>

            <div class="flex flex-col gap-2">
                {#each $exerciseList.filter((e) => filter === null || e.category === filter) as exercise}
                    <Button
                        class="w-full text-left px-4 py-2 rounded-md bg-white shadow-sm border text-gray-700"
                        on:click={() => onclick(exercise)}
                    >
                        {exercise.name}
                    </Button>
                {/each}
            </div>
        {:else}
            <DropdownModal />
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
