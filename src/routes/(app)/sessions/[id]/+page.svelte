<script lang="ts">
    import SingleSet from "./SingleSet.svelte";
    import { dragHandleZone, dragHandle } from "svelte-dnd-action";
    import AddExercise from "./AddExercise.svelte";
    import Menu from "$components/Menu.svelte";
    import { flip } from "svelte/animate";
    import type { PageData } from "./$types";
    import { enhance } from "$app/forms";
    import Clock from "$components/Clock.svelte";
    import EditExerciseButton from "./EditExerciseButton.svelte";
    import EditSeButton from "./EditSEButton.svelte";

    export let data: PageData;
    if (data.session === null) {
        throw new Error("Session not found");
    }

    function handleReorder(event: CustomEvent) {
        data.session!.session_exercises = event.detail.items;
    }
    function finalizeReorder(event: CustomEvent) {
        const newOrder = event.detail.items.map(
            (item: any) => item.exercise.id,
        );
        const input = document.getElementById(
            "exercise-order-input",
        ) as HTMLInputElement;
        input.value = JSON.stringify(newOrder);

        const button = document.getElementById(
            "hidden-submit",
        ) as HTMLButtonElement;
        button.click();
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

        return `${yyyy}.${mm}.${dd}`;
    }
    let addingExercise = false;
    let clockButtonToggle = false;
</script>

<Menu
    name={formatSessionDate(data.session!.date)}
    bind:addButtonToggle={addingExercise}
    bind:clockButtonToggle
/>
<section class="p-2">
    <form
        method="POST"
        action="?/reorder_session_exercises"
        id="reorder-form"
        use:enhance
    >
        <input type="hidden" name="exercise_ids" id="exercise-order-input" />
        <button type="submit" id="hidden-submit" style="display: none;"
            >Submit</button
        >
    </form>

    {#if addingExercise}
        <AddExercise categories={data.categories} exercises={data.exercises} />
    {/if}
    {#if clockButtonToggle}
        <div class="flex justify-center items-center">
            <Clock />
        </div>
    {/if}

    {#if data.session!.session_exercises && data.session!.session_exercises.length > 0}
        <div
            use:dragHandleZone={{
                items: data.session!.session_exercises,
                dropTargetStyle: {
                    border: "none",
                },
                flipDurationMs: 200,
            }}
            on:consider={handleReorder}
            on:finalize={finalizeReorder}
        >
            {#each data.session!.session_exercises as SE (SE.id)}
                <div
                    class={`rounded-md shadow-md p-3 my-3 border animate-fade-in ${
                        SE.completed
                            ? "bg-emerald-900/90 border-emerald-400"
                            : "bg-seal-brown/90 border-burnt-umber"
                    }`}
                    animate:flip={{ duration: 200 }}
                >
                    <div class="flex justify-between items-center mb-2">
                        <!-- Left: Drag handle + Title -->
                        <div class="flex items-center gap-2 min-w-0">
                            <div
                                use:dragHandle
                                aria-label="Drag handle for {SE.exercise.name}"
                                class="cursor-move select-none text-thistle"
                                title="Drag to reorder"
                            >
                                ⠿
                            </div>
                            <h3
                                class="text-lg font-semibold text-thistle truncate"
                            >
                                {SE.exercise.name}
                            </h3>
                        </div>

                        <!-- Right: Buttons -->
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <EditExerciseButton
                                exercise_id={SE.exercise.id}
                                completed={SE.completed}
                            />
                            <EditSeButton id={SE.id} completed={SE.completed} />

                            <form
                                method="POST"
                                action="?/create_set"
                                use:enhance
                            >
                                <input
                                    type="hidden"
                                    name="session_id"
                                    value={data.session!.id || ""}
                                />
                                <input
                                    type="hidden"
                                    name="exercise_id"
                                    value={SE.exercise.id || ""}
                                />

                                <button
                                    type="submit"
                                    class={`p-2 rounded-md shadow-md transition duration-200 ${
                                        SE.completed
                                            ? "bg-emerald-700 text-white hover:bg-emerald-600"
                                            : "bg-seal-brown text-thistle hover:bg-burnt-umber"
                                    }`}
                                    aria-label="Add set"
                                >
                                    <svg
                                        class="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        {#each SE.sets as set (set.id)}
                            <SingleSet
                                {set}
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
