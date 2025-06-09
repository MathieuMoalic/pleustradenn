<script lang="ts">
    import SingleSet from "./SingleSet.svelte";
    import { dragHandleZone, dragHandle } from "svelte-dnd-action";
    import AddExercise from "./AddExercise.svelte";
    import Menu from "$components/Menu.svelte";
    import type { PageData } from "./$types";
    import { enhance } from "$app/forms";
    import Clock from "$components/Clock.svelte";
    import EditExerciseButton from "./EditExerciseButton.svelte";
    import EditSeButton from "./EditSEButton.svelte";
    import { fly } from "svelte/transition";

    export let data: PageData;
    if (data.session === null) {
        throw new Error("Session not found");
    }

    type PlaceholderSet = {
        session_exercise_id: number;
        reps: number;
        intensity: number;
    };

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
                    class={`relative flex rounded-md shadow-md p-3 my-3 border animate-fade-in ${
                        SE.completed
                            ? "bg-emerald-900/90 border-emerald-400"
                            : "bg-seal-brown/90 border-burnt-umber"
                    }`}
                >
                    <!-- Drag Handle Column -->
                    <div
                        use:dragHandle
                        aria-label="Drag handle for {SE.exercise.name}"
                        class="w-8 flex-shrink-0 flex items-center justify-center relative"
                        title="Drag to reorder"
                    >
                        <div
                            class="absolute inset-0 bg-white/5 rounded-l-md hover:bg-white/10 transition"
                        ></div>
                        <div
                            class="z-10 text-thistle text-xl leading-none select-none pointer-events-none"
                        >
                            ⠿
                        </div>
                    </div>

                    <!-- Content Column -->
                    <div class="flex-1 flex flex-col gap-2">
                        <!-- Header Row -->
                        <div
                            class="flex justify-between items-center w-full overflow-hidden"
                        >
                            <h3
                                class="ml-4 text-lg font-semibold text-thistle truncate whitespace-nowrap overflow-hidden max-w-[12rem]"
                                title={SE.exercise.name}
                            >
                                {SE.exercise.name}
                            </h3>

                            <div class="flex items-center gap-2 flex-shrink-0">
                                <form
                                    method="POST"
                                    action="?/delete_session_exercise"
                                    use:enhance
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={SE.id || ""}
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
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m14 0H5m2 0V5a2 2 0 012-2h6a2 2 0 012 2v2"
                                            ></path></svg
                                        >
                                    </button>
                                </form>

                                <EditExerciseButton
                                    exercise_id={SE.exercise.id}
                                    completed={SE.completed}
                                />
                                <EditSeButton
                                    id={SE.id}
                                    completed={SE.completed}
                                />

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

                        <!-- Set List -->
                        <div class="flex flex-col gap-1">
                            {#each SE.sets as set, i (set.id)}
                                <div
                                    class="flex items-start w-full"
                                    in:fly={{
                                        y: -20,
                                        opacity: 0,
                                        duration: 200,
                                    }}
                                >
                                    {#if set.id <= 0}
                                        <div
                                            class="flex items-center justify-between px-2 py-2 w-full bg-black-bean/70 rounded-md text-thistle ml-9 text-sm"
                                        >
                                            <div
                                                class="flex items-center gap-4"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    class="w-5 h-5 text-thistle"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        d="M17 2v2h1a2 2 0 012 2v2a5 5 0 01-4 4.9V15h2v2H8v-2h2v-2.1A5 5 0 016 8V6a2 2 0 012-2h1V2h8zm-1 2H8v2a3 3 0 006 0V4z"
                                                    />
                                                </svg>

                                                {set.reps} x {set.intensity}{SE
                                                    .exercise.intensity_unit}
                                            </div>
                                        </div>
                                    {:else}
                                        <span
                                            class="w-6 h-6 flex items-center justify-center text-thistle font-mono m-2 mr-1"
                                        >
                                            {i + 1}.
                                        </span>
                                        <SingleSet
                                            {set}
                                            unit={SE.exercise.intensity_unit}
                                        />
                                    {/if}
                                </div>
                            {/each}
                        </div>
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
