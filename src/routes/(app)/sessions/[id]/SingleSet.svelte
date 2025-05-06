<script lang="ts">
    import PlusMinusButton from "./PlusMinusButton.svelte";
    import DeleteButton from "./DeleteButton.svelte";
    import SubmitButton from "./SubmitButton.svelte";
    import NumberInput from "./NumberInput.svelte";
    import type { Set } from "@prisma/client";
    import { enhance } from "$app/forms";

    export let set: Set;
    export let unit: string;

    let expended: boolean = true;

    function decrementReps() {
        set = { ...set, reps: Math.max(0, set.reps - 1) };
    }

    function incrementReps() {
        set = { ...set, reps: set.reps + 1 };
    }

    function incrementIntensity(step: number = 1.0) {
        const newIntensity = parseFloat((set.intensity + step).toFixed(1));
        set = { ...set, intensity: Math.max(0, newIntensity) };
    }

    function decrementIntensity(step: number = 1.0) {
        set = { ...set, intensity: Math.max(0, set.intensity - step) };
    }
</script>

<form
    method="POST"
    action="?/update_set"
    data-set-id={set.id}
    class="flex flex-col bg-black-bean/40 text-plum rounded-md shadow-sm border border-burnt-umber text-sm overflow-hidden"
    use:enhance
>
    <input type="hidden" name="id" value={set.id} />
    <input type="hidden" name="exercise_id" value={set.exercise_id} />

    <div
        class="flex items-center justify-between px-3 py-2 w-full gap-4 bg-black-bean/40 rounded-md focus-within:ring-1 focus-within:ring-plum"
    >
        <button
            type="button"
            on:click={() => (expended = !expended)}
            class="flex-1 text-left focus:outline-none"
            aria-controls={`set-details-${set.id}`}
            aria-label={`Toggle details for Set ${set.reps}x${set.intensity}`}
        >
            <span class="font-medium truncate block">
                {set.reps} x {set.intensity}{unit}
            </span>
        </button>

        {#if expended}
            <div class="flex items-center gap-2">
                <SubmitButton />
                <DeleteButton />
            </div>
        {/if}

        <svg
            class="w-4 h-4 flex-shrink-0 transition-transform duration-200 {expended
                ? 'rotate-180'
                : ''} text-plum"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
            ></path>
        </svg>
    </div>

    {#if expended}
        <div
            id={`set-details-${set.id}`}
            class="p-3 border-t border-burnt-umber space-y-3"
        >
            <div class="flex items-center justify-between">
                <label
                    for={`reps-expanded-${set.id}`}
                    class="text-thistle font-medium">Reps:</label
                >
                <div class="flex items-center gap-2">
                    <PlusMinusButton
                        callback={decrementReps}
                        plusOrMinus="minus"
                    />
                    <NumberInput
                        name="reps"
                        id={set.id}
                        bind:value={set.reps}
                    />
                    <PlusMinusButton callback={incrementReps} />
                </div>
            </div>

            <div class="flex items-center justify-between">
                <label
                    for={`intensity-expanded-${set.id}`}
                    class="text-thistle font-medium">Intensity ({unit}):</label
                >
                <div class="flex items-center gap-2">
                    <PlusMinusButton
                        callback={decrementIntensity}
                        plusOrMinus="minus"
                    />
                    <NumberInput
                        name="intensity"
                        id={set.id}
                        bind:value={set.intensity}
                    />
                    <PlusMinusButton callback={incrementIntensity} />
                </div>
            </div>
        </div>
    {/if}
</form>
