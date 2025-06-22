<script lang="ts">
    import Navbar from "$components/Navbar.svelte";
    import { t, exerciseNamei18n } from "$lib/stores/i18n";
    import type { PageData, ActionData } from "./$types";
    import ExerciseForm from "../ExerciseForm.svelte";
    import NewExerciseButton from "../NewExerciseButton.svelte";

    export let form: ActionData;
    export let data: PageData;
    let ex = data.exercise ?? {
        id: -1,
        category: "other",
        intensity_unit: "kg",
        name: "",
        name_pl: "",
        name_fr: "",
        notes: "",
    };

    function getDate(date: Date): string {
        return new Date(date).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    }

    function getTime(date: Date): string {
        return new Date(date).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    }
</script>

<Navbar name={exerciseNamei18n(ex)}>
    <div slot="actions" class="flex gap-2">
        <NewExerciseButton />
    </div>
</Navbar>

<ExerciseForm {form} {ex} />

<h2 class="text-2xl font-bold text-thistle m-4">
    {$t("log")}
</h2>
{#if data.sets && data.sets.length > 0}
    {#each data.sets as setGroup}
        <div
            class="bg-burnt-umber/80 border border-seal-brown rounded-md p-4 mb-4 shadow-sm m-2"
        >
            <h3 class="text-lg font-semibold text-thistle mb-2">
                {getDate(setGroup[0].created_at)}
            </h3>

            {#each setGroup as set}
                <div
                    class="text-thistle text-sm py-1 border-b border-seal-brown last:border-b-0"
                >
                    {getTime(set.created_at)} –
                    <span class="font-semibold">{set.reps}</span> x
                    <span class="font-semibold">{set.intensity}</span>
                </div>
            {/each}
        </div>
    {/each}
{:else}
    <p class="text-thistle m-3 text-xl">
        {$t("no_sets_found")}
    </p>
{/if}
