<script lang="ts">
    import PBSet from "./PBSet.svelte";
    import SingleSet from "./SingleSet.svelte";
    import Navbar from "$components/Navbar.svelte";

    import { exerciseNamei18n, t } from "$lib/stores/i18n";

    import { dragHandleZone, dragHandle } from "svelte-dnd-action";
    import type { PageData } from "./$types";
    import { enhance } from "$app/forms";
    import { fade, fly } from "svelte/transition";
    import Plus from "$components/icons/Plus.svelte";
    import ClockIcon from "$components/icons/Clock.svelte";
    import AddExercise from "./AddExercise.svelte";
    import Clock from "$components/Clock.svelte";
    import SeButtons from "./SEButtons.svelte";

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
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        return `${yyyy}.${mm}.${dd}`;
    }
    let showClock = false;
    let showAddExercise = false;
    import { browser } from "$app/environment";

    $: if (browser) {
        if (showAddExercise || showClock) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }

    function onDeleteSet(id: number) {
        data.session = {
            ...data.session,
            session_exercises: data.session.session_exercises
                .map((se) => ({
                    ...se,
                    sets: se.sets.filter((s) => s.id !== id),
                }))
                .filter((se) => se.sets.length), // remove empty exercises
        };
    }
</script>

<Navbar name={formatSessionDate(data.session!.date)}>
    <div slot="actions" class="flex gap-2">
        <button
            on:click={() => (showClock = !showClock)}
            class="bg-green-700 p-1 rounded text-thistle border border-thistle/40"
        >
            <ClockIcon className="w-4 h-4" />
        </button>
        <button
            class="bg-green-700 p-1 rounded text-thistle border border-thistle/40"
            on:click={() => (showAddExercise = !showAddExercise)}
        >
            <Plus className="w-4 h-4" />
        </button>
    </div>
</Navbar>

{#if showAddExercise || showClock}
    <div
        class="fixed inset-x-0 top-0 bottom-0 z-40 space-y-2 overflow-y-auto bg-seal-brown/55 p-4"
        in:fade
    >
        {#if showAddExercise}
            <AddExercise
                exercises={data.exercises}
                onClose={() => (showAddExercise = false)}
            />
        {/if}

        {#if showClock}
            <Clock onclick={() => (showClock = !showClock)} />
        {/if}
    </div>
{/if}

<section class="p-2 pt-0">
    <form
        method="POST"
        action="?/reorder_session_exercises"
        id="reorder-form"
        use:enhance
    >
        <input type="hidden" name="exercise_ids" id="exercise-order-input" />
        <button type="submit" id="hidden-submit" style="display: none;">
            Submit
        </button>
    </form>

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

                    <div class="flex-1 flex flex-col gap-2">
                        <h3
                            class="ml-2 truncate whitespace-nowrap overflow-hidden text-sm font-medium text-thistle min-w-0"
                            title={SE.exercise.name}
                        >
                            {exerciseNamei18n(SE.exercise)}
                        </h3>

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
                                        <PBSet
                                            {set}
                                            unit={SE.exercise.intensity_unit}
                                        />
                                    {:else}
                                        <span
                                            class="w-6 h-6 flex items-center justify-center text-thistle font-mono m-2 mr-1"
                                        >
                                            {i + 1}.
                                        </span>
                                        <SingleSet
                                            {set}
                                            unit={SE.exercise.intensity_unit}
                                            onDelete={onDeleteSet}
                                        />
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                    <SeButtons {SE} />
                </div>
            {/each}
        </div>
    {:else}
        <p
            class="text-plum p-3 text-xl shadow-sm rounded-md bg-seal-brown/50 m-2"
        >
            {$t("no_sets")}
        </p>
    {/if}
</section>
