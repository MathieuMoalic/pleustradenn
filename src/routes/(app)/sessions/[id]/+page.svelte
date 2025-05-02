<script lang="ts">
    import AddSetButton from "./AddSetButton.svelte";
    import SingleSet from "./SingleSet.svelte";
    import { dndzone } from "svelte-dnd-action";
    import AddExercise from "./AddExercise.svelte";
    import Menu from "$components/Menu.svelte";
    import { flip } from "svelte/animate";
    import type { PageData } from "./$types";

    export let data: PageData;
    if (data.session === null) {
        throw new Error("Session not found");
    }
    let SEs = data.session.session_exercises;

    function handleReorder(event: CustomEvent) {
        SEs = event.detail.items;
    }
    function finalizeReorder(event: CustomEvent) {
        const newOrder = event.detail.items.map(
            (item: any) => item.exercise.id,
        );
        const input = document.getElementById(
            "exercise-order-input",
        ) as HTMLInputElement;
        input.value = JSON.stringify(newOrder);

        const form = document.getElementById("reorder-form") as HTMLFormElement;
        form.submit();
    }

    function formatSessionDate(date: Date): string {
        const today = new Date();
        const isToday =
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();

        if (isToday) {
            return "Today's session";
        }

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        return `Session of ${yyyy}.${mm}.${dd}`;
    }
    let addingExercise = false;
</script>

<Menu
    name={formatSessionDate(data.session!.date)}
    bind:addButtonToggle={addingExercise}
/>
<section class="p-2">
    <form method="POST" action="?/reorder_session_exercises" id="reorder-form">
        <input type="hidden" name="exercise_ids" id="exercise-order-input" />
    </form>

    {#if addingExercise}
        <AddExercise categories={data.categories} exercises={data.exercises} />
    {/if}

    {#if SEs && SEs.length > 0}
        <div
            use:dndzone={{
                items: SEs,
                dropTargetStyle: {
                    border: "none",
                },
                flipDurationMs: 200,
            }}
            on:consider={handleReorder}
            on:finalize={finalizeReorder}
        >
            {#each SEs as SE (SE.id)}
                <div
                    class="bg-seal-brown/90 rounded-md shadow-md p-3 border border-burnt-umber my-3"
                    animate:flip={{ duration: 200 }}
                >
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-lg font-semibold text-thistle truncate">
                            {SE.exercise.name}
                        </h3>
                        <div class="flex items-center gap-2">
                            <AddSetButton
                                session_id={data.session!.id}
                                exercise_id={SE.exercise.id}
                            />
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        {#each SE.sets as set (set.id)}
                            <SingleSet
                                bind:set
                                unit={SE.exercise.intensity_unit}
                            />
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
