<script lang="ts">
    import type { SetWithExercise } from "$lib/types";
    import DecrementButton from "./Buttons/DecrementButton.svelte";
    import DeleteButton from "./Buttons/DeleteButton.svelte";
    import IncrementButton from "./Buttons/IncrementButton.svelte";
    import SubmitButton from "./Buttons/SubmitButton.svelte";
    import NumberInput from "./NumberInput.svelte";

    export let set: SetWithExercise;

    let expended: boolean = false;

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
    action="?/update"
    data-set-id={set.id}
    class="flex flex-col bg-black-bean text-plum rounded-md shadow-sm border border-burnt-umber text-sm overflow-hidden"
>
    <input type="hidden" name="id" value={set.id} />
    <input type="hidden" name="exercise_id" value={set.exercise_id} />

    <button
        type="button"
        on:click={() => (expended = !expended)}
        class="flex justify-between items-center px-3 py-2 w-full text-left focus:outline-none focus:ring-1 focus:ring-plum"
        aria-controls={`set-details-${set.id}`}
        aria-label={`Toggle details for Set ${set.reps}x${set.intensity}`}
    >
        <div class="flex-grow min-w-0 mr-2">
            <span class="font-medium">
                {set.reps} x {set.intensity}{set.exercise.intensity_unit || ""}
            </span>
        </div>
        <svg
            class="w-4 h-4 transition-transform duration-200 {expended
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
    </button>

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
                    <DecrementButton callback={decrementReps} />
                    <NumberInput
                        name="reps"
                        id={set.id}
                        bind:value={set.reps}
                    />
                    <IncrementButton callback={incrementReps} />
                </div>
            </div>

            <div class="flex items-center justify-between">
                <label
                    for={`intensity-expanded-${set.id}`}
                    class="text-thistle font-medium"
                    >Intensity ({set.exercise.intensity_unit || ""}):</label
                >
                <div class="flex items-center gap-2">
                    <DecrementButton callback={decrementIntensity} />
                    <NumberInput
                        name="intensity"
                        id={set.id}
                        bind:value={set.intensity}
                    />
                    <IncrementButton callback={incrementIntensity} />
                </div>
            </div>

            <div class="flex justify-end gap-2 pt-2">
                <SubmitButton />
                <DeleteButton />
            </div>
        </div>
    {/if}
</form>
