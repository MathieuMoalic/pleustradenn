<script lang="ts">
    import AddSetButton from "$components/Sets/AddSetButton.svelte";
    import type { GroupedSets } from "$lib/types";
    import SingleSet from "$components/Sets/SingleSet.svelte";
    import AddExerciseButton from "$components/AddExerciseButton.svelte";
    import type { Exercise, ExerciseCategory } from "@prisma/client";
    import { dndzone } from "svelte-dnd-action";

    export let data: {
        groupedSets: GroupedSets[];
        categories: ExerciseCategory[];
        exercises: Exercise[];
    };

    function handleReorder(event: CustomEvent) {
        data.groupedSets = event.detail.items;
    }
    function finalizeReorder(event: CustomEvent) {
        const newOrder = event.detail.items.map(
            (item: GroupedSets) => item.exercise.id,
        );
        const input = document.getElementById(
            "exercise-order-input",
        ) as HTMLInputElement;
        input.value = JSON.stringify(newOrder);

        const form = document.getElementById("reorder-form") as HTMLFormElement;
        form.submit();
    }
</script>

<section class="p-2">
    <form method="POST" action="?/reorder" id="reorder-form">
        <input type="hidden" name="exerciseIds" id="exercise-order-input" />
    </form>

    <h2 class="text-xl font-bold text-thistle mb-3">Sets</h2>
    <AddExerciseButton
        categories={data.categories}
        exercises={data.exercises}
    />

    {#if data.groupedSets && data.groupedSets.length > 0}
        <div
            use:dndzone={{
                items: data.groupedSets,
            }}
            on:consider={handleReorder}
            on:finalize={finalizeReorder}
        >
            {#each data.groupedSets as group (group.id)}
                <div
                    class="bg-seal-brown rounded-md shadow-md p-3 border border-burnt-umber my-3"
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
