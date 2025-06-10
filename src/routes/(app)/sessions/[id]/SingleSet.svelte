<script lang="ts">
    import PlusMinusButton from "./PlusMinusButton.svelte";
    import DeleteButton from "./DeleteButton.svelte";
    import NumberInput from "./NumberInput.svelte";
    import type { Set } from "@prisma/client";
    import { enhance } from "$app/forms";
    import { tick } from "svelte";

    export let set: Set;
    export let unit: string;

    let originalSet: Set = { ...set };

    let expended: boolean = false;

    async function decrementReps() {
        set = { ...set, reps: Math.max(0, set.reps - 1) };
    }

    async function incrementReps() {
        set = { ...set, reps: set.reps + 1 };
    }

    async function incrementIntensity(step: number = 1.0) {
        const newIntensity = parseFloat((set.intensity + step).toFixed(1));
        set = { ...set, intensity: Math.max(0, newIntensity) };
    }

    async function decrementIntensity(step: number = 1.0) {
        set = { ...set, intensity: Math.max(0, set.intensity - step) };
    }

    function toggleExpended() {
        const wasExpended = expended;
        expended = !expended;

        if (wasExpended && !expended) {
            if (
                originalSet.reps !== set.reps ||
                originalSet.intensity !== set.intensity
            ) {
                originalSet = { ...set };
                tick().then(() => form?.requestSubmit());
            }
        }
    }

    let form: HTMLFormElement;
</script>

<form
    bind:this={form}
    method="POST"
    action="?/update_set"
    data-set-id={set.id}
    class="flex flex-col flex-1 bg-black-bean/40 text-plum rounded-md shadow-sm text-sm overflow-hidden"
    use:enhance
>
    <input type="hidden" name="id" value={set.id} />
    <input type="hidden" name="exercise_id" value={set.exercise_id} />
    <input type="hidden" name="reps" value={set.reps} />
    <input type="hidden" name="intensity" value={set.intensity} />

    <div
        class="flex items-center justify-between px-3 py-2 w-full gap-4 bg-black-bean/40 rounded-md focus-within:ring-0 focus-within:ring-plum"
    >
        <DeleteButton />
        <button
            type="button"
            on:click={toggleExpended}
            class="flex-1 text-left focus:outline-none"
            aria-controls={`set-details-${set.id}`}
            aria-label={`Toggle details for Set ${set.reps}x${set.intensity}`}
        >
            <span class="font-medium truncate block">
                {set.reps} x {set.intensity}{unit}
            </span>
        </button>

        <button
            type="button"
            on:click={toggleExpended}
            class="p-1 rounded focus:outline-none"
            aria-label="Toggle details"
        >
            <svg
                class="w-4 h-4 transition-transform duration-200 {expended
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
                />
            </svg>
        </button>
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
                <div class="flex items-center gap-0">
                    <PlusMinusButton
                        callback={decrementReps}
                        plusOrMinus="minus"
                    />
                    <NumberInput
                        name="reps"
                        id={set.id}
                        {form}
                        bind:value={set.reps}
                    />
                    <PlusMinusButton callback={incrementReps} />
                </div>
            </div>

            <div class="flex items-center justify-between">
                <label
                    for={`intensity-expanded-${set.id}`}
                    class="text-thistle font-medium">{unit}:</label
                >
                <div class="flex items-center">
                    <PlusMinusButton
                        callback={decrementIntensity}
                        plusOrMinus="minus"
                    />
                    <NumberInput
                        name="intensity"
                        id={set.id}
                        {form}
                        bind:value={set.intensity}
                    />
                    <PlusMinusButton callback={incrementIntensity} />
                </div>
            </div>
        </div>
    {/if}
</form>
