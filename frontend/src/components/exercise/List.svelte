<script lang="ts">
    import { EditOutline } from "flowbite-svelte-icons";
    import { exerciseList, editExercise } from "$lib/exercise";
</script>

<section class="space-y-2">
    <div class="flex flex-col gap-2">
        {#each $exerciseList as ex}
            <div
                class="bg-burnt-umber text-white p-3 rounded-md shadow-sm flex justify-between items-center"
            >
                <div class="flex flex-col">
                    <h3 class="text-sm font-semibold leading-tight">
                        {ex.name}
                    </h3>
                    <p class="text-xs text-thistle mt-0.5">
                        {ex.notes || "No notes"}
                    </p>
                </div>
                <button
                    class="flex items-center justify-center bg-plum text-black-bean p-1.5 rounded-md hover:bg-thistle transition duration-200"
                    on:click={() => editExercise(ex)}
                >
                    <EditOutline class="w-4 h-4" />
                </button>
            </div>
        {/each}
    </div>
</section>
