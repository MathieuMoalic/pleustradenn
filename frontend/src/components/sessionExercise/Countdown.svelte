<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { CheckOutline } from "flowbite-svelte-icons";
    import type { SessionExerciseRead } from "$lib/api";
    import { incrementSet } from "$lib/session-exercise";

    export let ex: SessionExerciseRead;
    let interval: number | null = null;

    let targetTime: number | null = null;
    let remaining = 0;

    function updateRemaining() {
        if (targetTime) {
            const diff = Math.max(
                0,
                Math.floor((targetTime - Date.now()) / 1000),
            );
            remaining = diff;

            // When finished, stop interval and reset state
            if (diff === 0 && interval) {
                clearInterval(interval);
                interval = null;
                targetTime = null;
            }
        }
    }

    function startCountdown() {
        if (interval || targetTime) return;

        targetTime = Date.now() + ex.rest_seconds * 1000;
        updateRemaining();

        interval = setInterval(updateRemaining, 500); // Check twice per second
    }

    function handleClick() {
        if (!interval && !targetTime) {
            startCountdown();
            ex = incrementSet(ex);
        }
    }

    onDestroy(() => clearInterval(interval!));
</script>

{#if !ex.completed}
    <button
        on:click={handleClick}
        class="bg-green-400 text-sm px-2 py-1 rounded-md text-center bg-opacity-40 border-opacity-80 w-10 h-8"
    >
        {#if !targetTime}
            <CheckOutline />
        {:else}
            {remaining}
        {/if}
    </button>
{/if}
