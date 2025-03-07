<script lang="ts">
    import { exerciseList, openExerciseModal } from "$lib/exercise";
    import AddNewButton from "$components/Modal/AddNewButton.svelte";
</script>

<section class="space-y-2">
    <div class="flex flex-col gap-2">
        <AddNewButton name="Exercise" onclick={openExerciseModal} />
        {#each $exerciseList as ex}
            <button
                on:click={() => openExerciseModal(ex)}
                class="bg-burnt-umber text-white p-3 rounded-md shadow-sm flex"
            >
                <div class="flex flex-col w-full">
                    <h3 class="text-sm font-semibold text-left">
                        {ex.name}
                    </h3>
                    <p class="text-xs text-thistle mt-0.5 text-left">
                        {ex.notes || "No notes"}
                    </p>
                </div>
            </button>
        {/each}
    </div>
</section>
