<script lang="ts">
    import { onDestroy } from "svelte";
    import { CheckOutline } from "flowbite-svelte-icons";
    import type { SessionExerciseRead } from "$lib/api";
    import { incrementSet } from "$lib/session-exercise";

    export let ex: SessionExerciseRead;
    let seconds = ex.rest_seconds;
    let interval: number | null = null;

    function startCountdown() {
        if (interval) return;
        interval = setInterval(() => {
            if (seconds > 0) {
                seconds--;
            } else {
                clearInterval(interval!);
                interval = null;
                seconds = ex.rest_seconds;
            }
        }, 1000);
    }

    function handleClick() {
        if (!interval) {
            seconds = ex.rest_seconds;
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
        {#if seconds === ex.rest_seconds}
            <CheckOutline class="" />
        {:else}
            {seconds}
        {/if}
    </button>
{/if}
