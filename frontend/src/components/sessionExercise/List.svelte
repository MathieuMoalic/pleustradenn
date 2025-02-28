<script lang="ts">
    import { addAlert } from "$lib/alert";
    import type { SessionExerciseRead } from "$lib/Api";
    import { getApi } from "$lib/auth";
    import { sessionExerciseModal, sessionId } from "$lib/store";
    import { EditOutline } from "flowbite-svelte-icons";
    import { onMount } from "svelte";

    let sessionExercises: SessionExerciseRead[] = [];
    onMount(async () => {
        if ($sessionId === null) {
            addAlert("Session ID is required", "error");
            return;
        }
        getApi()
            .sessionRead($sessionId)
            .then((res) => {
                if (!res.data.session_exercises) {
                    return;
                }
                sessionExercises = res.data.session_exercises;
            });
    });
</script>

<section class="space-y-2">
    <div class="flex flex-col gap-2">
        {#each sessionExercises as ex}
            <div
                class="bg-burnt-umber text-white p-3 rounded-md shadow-sm flex justify-between items-center"
            >
                <div class="flex flex-col">
                    <h3 class="text-sm font-semibold leading-tight">
                        {ex.exercise_id}
                    </h3>
                </div>
                <button
                    class="flex items-center justify-center bg-plum text-black-bean p-1.5 rounded-md hover:bg-thistle transition duration-200"
                    on:click={() => {
                        $sessionExerciseModal.isOpen = true;
                        $sessionExerciseModal.mode = "edit";
                        $sessionExerciseModal.sessionExercise = ex;
                        $sessionExerciseModal.sessionExerciseID = ex.id;
                    }}
                >
                    <EditOutline class="w-4 h-4" />
                </button>
            </div>
        {/each}
    </div>
</section>
