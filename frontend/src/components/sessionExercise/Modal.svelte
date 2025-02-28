<script lang="ts">
    import { addAlert } from "$lib/alert";
    import { SEModal } from "$lib/store";
    import { Button, Modal, Label, Input } from "flowbite-svelte";
    import { getApi } from "$lib/auth";
    import { onMount } from "svelte";
    import Dropdown from "$components/sessionExercise/Dropdown.svelte";
    onMount(async () => {
        if ($SEModal.mode === "edit") {
            getApi()
                .sessionExerciseReadDetailed($SEModal.id)
                .then((res) => {
                    $SEModal = { ...$SEModal, ...res.data };
                })
                .catch((res) => {
                    addAlert(
                        `Failed to fetch the sessionExercise '${$SEModal.id}': ${res.error.detail}`,
                        "error",
                    );
                });
        }
    });

    async function submitSessionExercise() {
        if ($SEModal.mode == "edit") {
            getApi()
                .sessionExerciseUpdate($SEModal.id, $SEModal)
                .then((_) => {
                    $SEModal.isOpen = false;
                    $SEModal.id = -1;
                })
                .catch((res) => {
                    addAlert(
                        `Failed to update the sessionExercise '${$SEModal.exercise_name}':${res.error.detail}`,
                        "error",
                    );
                });
            return;
        } else if ($SEModal.mode == "add") {
            getApi()
                .sessionExerciseCreate($SEModal)
                .then((_) => {
                    $SEModal = {
                        isOpen: false,
                        mode: "add",
                        id: -1,
                        session_id: -1,
                        exercise_id: -1,
                        sets: 0,
                        reps: 0,
                        weight: 0,
                        rest_seconds: 0,
                        count: 0,
                        exercise_name: "",
                    };
                })
                .catch((res) => {
                    addAlert(
                        `Failed to create the sessionExercise '${$SEModal.exercise_name}': ${res.error.detail}`,
                        "error",
                    );
                });
        }
    }

    async function removeSessionExercise() {
        getApi()
            .sessionExerciseDelete($SEModal.id)
            .then((_) => {
                $SEModal.isOpen = false;
                $SEModal.id = -1;
            })
            .catch((res) => {
                addAlert(
                    `Failed to delete the sessionExercise '${$SEModal.exercise_name}':${res.error.detail}`,
                    "error",
                );
            });
    }
</script>

<Modal
    bind:open={$SEModal.isOpen}
    size="xs"
    outsideclose
    class="bg-plum text-primaryText rounded-lg"
>
    <div
        class="flex flex-col space-y-4 p-3 rounded-lg shadow-lg bg-primaryBg text-primaryText"
        role="dialog"
    >
        <h3 class="text-lg font-semibold text-primaryText">
            {#if $SEModal.mode == "edit"}
                Edit Session Exercise
            {:else}
                Add a New Session Exercise
            {/if}
        </h3>
        <Label class="space-y-1 text-sm text-primaryText">
            <span>Exercise</span>
            <Dropdown />
        </Label>

        <Label class="space-y-1 text-sm text-primaryText">
            <span>Sets</span>
            <Input
                type="number"
                name="sets"
                class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                placeholder="Enter the number of sets"
                required
                bind:value={$SEModal.sets}
            />
        </Label>

        <Label class="space-y-1 text-sm text-primaryText">
            <span>Reps</span>
            <Input
                type="number"
                name="reps"
                class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                placeholder="Enter the number of reps"
                required
                bind:value={$SEModal.reps}
            />
        </Label>

        <Label class="space-y-1 text-sm text-primaryText">
            <span>Weight</span>
            <Input
                type="number"
                name="weight"
                class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                placeholder="Enter the weight"
                required
                bind:value={$SEModal.weight}
            />
        </Label>

        <Label class="space-y-1 text-sm text-primaryText">
            <span>Rest Seconds</span>
            <Input
                type="number"
                name="rest_seconds"
                class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                placeholder="Enter the rest seconds"
                required
                bind:value={$SEModal.rest_seconds}
            />
        </Label>

        <Label class="space-y-1 text-sm text-primaryText">
            <span>Count</span>
            <Input
                type="number"
                name="count"
                class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                placeholder="Enter the count"
                required
                bind:value={$SEModal.count}
            />
        </Label>

        <Button
            type="submit"
            class="w-full py-2 bg-burnt-umber text-primaryText font-semibold rounded-md"
            on:click={submitSessionExercise}
        >
            {#if $SEModal.mode == "edit"}
                Save
            {:else}
                Add Session Exercise
            {/if}
        </Button>

        {#if $SEModal.mode == "edit"}
            <Button
                type="button"
                class="w-full py-2 bg-red-600 hover:bg-red-700 text-primaryText font-semibold rounded-md"
                on:click={removeSessionExercise}
            >
                Delete
            </Button>
        {/if}
    </div>
</Modal>
