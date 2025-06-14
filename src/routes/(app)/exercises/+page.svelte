<script lang="ts">
    import Menu from "$components/Menu.svelte";
    import type { PageData } from "./$types";
    import ExerciseForm from "./ExerciseForm.svelte";
    import { page } from "$app/state";
    import { onMount, tick } from "svelte";
    import { goto } from "$app/navigation";
    import { exerciseNamei18n } from "$lib/stores/i18n";
    import { t } from "$lib/stores/i18n";

    export let data: PageData;
    $: categories = data.categories;
    $: exercises = data.exercises;

    let expandedExerciseId: number | null = null;

    const params = page.url.searchParams;
    const editId = params.get("edit");

    if (editId) {
        expandedExerciseId = parseInt(editId);
    }

    async function toggleExpand(exerciseId: number) {
        if (expandedExerciseId === exerciseId) {
            expandedExerciseId = null;

            const url = new URL(page.url);
            url.searchParams.delete("edit");
            goto(url.pathname + url.search, {
                replaceState: true,
                noScroll: true,
            });
        } else {
            expandedExerciseId = exerciseId;

            const url = new URL(page.url);
            url.searchParams.set("edit", exerciseId.toString());
            goto(url.pathname + url.search, {
                replaceState: true,
                noScroll: true,
            });

            // Wait for DOM to update, then scroll
            await tick();
            const el = document.getElementById(`exercise-${exerciseId}`);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });

                // Optionally add some padding if the header obscures the top
                // Use a short timeout to scroll slightly down after the first scroll
                setTimeout(() => {
                    window.scrollBy({ top: -20, behavior: "smooth" });
                }, 300);
            }
        }
    }

    let new_ex = {
        id: -1,
        category_id: 0,
        intensity_unit: "kg",
        name: "",
        name_pl: "",
        name_fr: "",
        notes: "",
    };
    let addingExercise = false;

    onMount(async () => {
        const params = page.url.searchParams;
        const editId = params.get("edit");

        if (editId) {
            expandedExerciseId = parseInt(editId);

            // Wait for DOM update, then scroll
            await tick();
            const el = document.getElementById(`exercise-${editId}`);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    });
</script>

<Menu name={$t("exercises")} bind:addButtonToggle={addingExercise} />
<section class="space-y-2 p-2">
    {#if addingExercise}
        <ExerciseForm ex={new_ex} {categories} {toggleExpand} />
    {/if}

    {#if exercises && exercises.length > 0}
        <div class="flex flex-col gap-2">
            {#each exercises as ex (ex.id)}
                <div
                    id={`exercise-${ex.id}`}
                    class="bg-burnt-umber/95 rounded-md shadow-sm overflow-hidden"
                >
                    <button
                        on:click={() => toggleExpand(ex.id)}
                        aria-expanded={expandedExerciseId === ex.id}
                        aria-controls={`exercise-details-${ex.id}`}
                        aria-label={`Toggle details for ${ex.name}`}
                        class="w-full text-left p-3 focus:outline-none focus:ring-2 focus:ring-burnt-umber"
                    >
                        <div class="flex justify-between items-center">
                            <div class="flex flex-col">
                                <h3 class="text-lg font-semibold text-thistle">
                                    {exerciseNamei18n(ex)}
                                </h3>
                            </div>
                            <svg
                                class="w-5 h-5 transition-transform duration-200 {expandedExerciseId ===
                                ex.id
                                    ? 'rotate-180'
                                    : ''} text-plum"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        </div>
                    </button>

                    {#if expandedExerciseId === ex.id}
                        <ExerciseForm {ex} {categories} {toggleExpand} />
                    {/if}
                </div>
            {/each}
        </div>
    {:else}
        <p class="text-base text-plum">
            {$t("no_exercises")}
        </p>
    {/if}
</section>
