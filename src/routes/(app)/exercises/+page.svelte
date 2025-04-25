<script lang="ts">
    export let data;
    import AddNewButton from "$components/AddNewButton.svelte";
    import { goto } from "$app/navigation";
</script>

<section class="space-y-2">
    {#if data.exercises.length > 0}
        <div class="flex flex-col gap-2">
            <AddNewButton
                name="Exercise"
                onclick={() => goto(`/exercises/new`)}
            />
            {#each data.exercises as ex (ex.id)}
                <button
                    on:click={() => goto(`/exercises/${ex.id}/edit`)}
                    aria-label={`View details for ${ex.name}`}
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
    {:else}
        <p class="text-xs text-gray-400">No exercises yet.</p>
    {/if}
</section>
