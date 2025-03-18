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
    import AddNewButton from "$components/Modal/AddNewButton.svelte";

    onMount(read);
</script>

<section>
    <div class="flex flex-col gap-2">
        <AddNewButton onclick={openSessionExerciseModal} name="Exercise" />

        {#each $sessionExerciseList as ex}
            <div
                class="{ex.completed
                    ? 'bg-green-800'
                    : 'bg-burnt-umber'} text-white p-3 rounded-md shadow-sm flex flex-col gap-2"
            >
                <div class="text-sm font-semibold text-left w-full">
                    {ex.exercise_name}
                </div>
                <div class="grid grid-cols-6 items-center w-full gap-2">
                    <span class="s2">
                        <Sets bind:ex />
                    </span>

                    <span class="s2">
                        <div class="s1">{ex.reps}</div>
                    </span>

                    <span class="x-span">x</span>

                    <span class="s2">
                        <div class="s1">{ex.weight}</div>
                        <div class="unit">kg</div>
                    </span>

                    <span class="s2">
                        <Countdown bind:ex />
                    </span>

                    <button
                        class="edit-btn"
                        on:click={() => openSessionExerciseModal(ex)}
                    >
                        <EditOutline class="w-4 h-4" />
                    </button>
                </div>
            </div>
        {/each}
    </div>
</section>

<style>
    .grid {
        grid-template-columns: repeat(6, 1fr);
    }

    .s2 {
        @apply flex justify-center min-w-[60px] w-full;
    }

    .s1 {
        @apply bg-seal-brown text-sm px-2 py-1 rounded-md border-2 text-center bg-opacity-40 border-opacity-80 w-full;
    }

    .x-span {
        @apply text-sm text-center w-full flex justify-center;
    }

    .unit {
        @apply text-sm pl-1 text-center flex items-center justify-center;
    }

    .edit-btn {
        @apply flex items-center justify-center bg-plum text-black-bean p-1.5 rounded-md ml-auto w-full max-w-[40px];
    }
</style>
