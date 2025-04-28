<script lang="ts">
    import AddSetButton from "$components/Sets/AddSetButton.svelte";
    import type { GroupedSets } from "$lib/types";
    import SingleSet from "$components/Sets/SingleSet.svelte";

    export let data: {
        groupedSets: GroupedSets[];
    };
</script>

<section class="p-2">
    <h2 class="text-xl font-bold text-thistle mb-3">Sets</h2>

    {#if data.groupedSets && data.groupedSets.length > 0}
        <div class="flex flex-col gap-4">
            {#each data.groupedSets as group (group.exercise.id)}
                <div
                    class="bg-seal-brown rounded-md shadow-md p-3 border border-burnt-umber"
                >
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-lg font-semibold text-thistle truncate">
                            {group.exercise.name}
                        </h3>
                        <div class="flex items-center gap-2">
                            <AddSetButton
                                session_id={group.sets[0].session_id}
                                exercise_id={group.exercise.id}
                            />
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        {#each group.sets as set (set.id)}
                            <SingleSet bind:set />
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p class="text-base text-plum">
            No sets recorded for this session yet.
        </p>
    {/if}
</section>
