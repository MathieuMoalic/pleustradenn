<script lang="ts">
    import Menu from "$components/Menu.svelte";
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";
    import { exerciseNamei18n } from "$lib/stores/i18n";
    import { t } from "$lib/stores/i18n";

    export let data: PageData;
    $: exercises = data.exercises;
</script>

<Menu name={$t("exercises")} addButtonCallback={() => goto(`/exercises/new`)} />
<section class="space-y-2 p-2">
    {#if exercises && exercises.length > 0}
        <div class="flex flex-col gap-2">
            {#each exercises as ex (ex.id)}
                <div
                    id={`exercise-${ex.id}`}
                    class="bg-burnt-umber/95 rounded-md shadow-sm overflow-hidden"
                >
                    <button
                        on:click={() => goto(`/exercises/${ex.id}`)}
                        class="w-full text-left p-3 focus:outline-none focus:ring-2 focus:ring-burnt-umber"
                    >
                        <div class="flex justify-between items-center">
                            <div class="flex flex-col">
                                <h3 class="text-lg font-semibold text-thistle">
                                    {exerciseNamei18n(ex)}
                                </h3>
                            </div>
                        </div>
                    </button>
                </div>
            {/each}
        </div>
    {:else}
        <p class="text-base text-plum">
            {$t("no_exercises")}
        </p>
    {/if}
</section>
