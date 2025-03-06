<script lang="ts">
    import {
        openSessionExerciseModal,
        sessionExerciseList,
        read,
    } from "$lib/session-exercise";
    import { EditOutline } from "flowbite-svelte-icons";
    import { onMount } from "svelte";
    import Countdown from "./Countdown.svelte";
    import Sets from "./Sets.svelte";

    onMount(read);
</script>

<section>
    <div class="flex flex-col gap-2">
        {#if $sessionExerciseList.length === 0}
            <p class="text-sm text-gray-500">No exercises added yet</p>
        {:else}
            {#each $sessionExerciseList as ex}
                <div
                    class="{ex.completed
                        ? 'bg-green-800'
                        : 'bg-burnt-umber'} text-white p-3 rounded-md shadow-sm flex flex-col gap-2"
                >
                    <div class="text-sm font-semibold text-left w-full">
                        {ex.exercise_name}
                    </div>
                    <div
                        class="grid grid-cols-[1fr_1fr_auto_1fr_auto_1fr] items-center w-full"
                    >
                        <span class="s2">
                            <Sets bind:ex />
                        </span>

                        <span class="s2">
                            <div class="s1">{ex.reps}</div>
                        </span>

                        <span class="x-span mr-2">x</span>

                        <span class="s2">
                            <div class="s1">{ex.weight}</div>
                            <div class="pl-1 pr-5 py-1">kg</div>
                        </span>

                        <span>
                            <Countdown bind:ex />
                        </span>

                        <button
                            class="flex items-center justify-center bg-plum text-black-bean p-1.5 rounded-md hover:bg-thistle transition duration-200 ml-auto"
                            on:click={() => openSessionExerciseModal(ex)}
                        >
                            <EditOutline class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</section>

<style>
    .s2 {
        @apply flex justify-center;
    }

    .s1 {
        @apply bg-seal-brown text-sm px-2 py-1 rounded-md border-2 text-center bg-opacity-40 border-opacity-80 w-12;
    }

    .x-span {
        @apply text-sm px-1 py-1 text-center;
    }
</style>
