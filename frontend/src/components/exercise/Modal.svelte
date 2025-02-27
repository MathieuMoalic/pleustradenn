<script lang="ts">
    import { addAlert } from "$lib/alert";
    import { exerciseModal } from "$lib/store";
    import { Button, Modal, Label, Input } from "flowbite-svelte";
    import { getApi } from "$lib/auth";

    async function submitExercise() {
        if ($exerciseModal.mode == "edit") {
            getApi()
                .exerciseUpdate(
                    $exerciseModal.exerciseID,
                    $exerciseModal.exercise,
                )
                .then((_) => {
                    $exerciseModal.isOpen = false;
                    $exerciseModal.exerciseID = -1;
                })
                .catch((res) => {
                    addAlert(
                        `Failed to update the exercise '${$exerciseModal.exercise.name}':${res.error.detail}`,
                        "error",
                    );
                });
            return;
        } else if ($exerciseModal.mode == "add") {
            if (!$exerciseModal.exercise.name) {
                addAlert("Name is required", "error");
                return;
            }
            if (!$exerciseModal.exercise.notes) {
                $exerciseModal.exercise.notes = "";
            }
            getApi()
                .exerciseCreate({
                    name: $exerciseModal.exercise.name,
                    notes: $exerciseModal.exercise.notes,
                })
                .then((_) => {
                    $exerciseModal.isOpen = false;
                    $exerciseModal.exerciseID = -1;
                    $exerciseModal.exercise = {
                        name: "",
                        notes: "",
                    };
                })
                .catch((res) => {
                    addAlert(
                        `Failed to create the exercise '${$exerciseModal.exercise.name}': ${res.error.detail}`,
                        "error",
                    );
                });
        }
    }

    async function removeExercise() {
        getApi()
            .exerciseDelete($exerciseModal.exerciseID)
            .then((_) => {
                $exerciseModal.isOpen = false;
                $exerciseModal.exerciseID = -1;
            })
            .catch((res) => {
                addAlert(
                    `Failed to delete the exercise '${$exerciseModal.exercise.name}':${res.error.detail}`,
                    "error",
                );
            });
    }
</script>

<Modal
    bind:open={$exerciseModal.isOpen}
    size="xs"
    outsideclose
    class="bg-plum text-primaryText rounded-lg"
>
    <div
        class="flex flex-col space-y-4 p-3 rounded-lg shadow-lg bg-primaryBg text-primaryText"
        role="dialog"
    >
        <h3 class="text-lg font-semibold text-primaryText">
            {#if $exerciseModal.mode == "edit"}
                Edit Exercise
            {:else}
                Add a New Exercise
            {/if}
        </h3>

        <Label class="space-y-1 text-sm text-primaryText">
            <span>Name</span>
            <Input
                type="text"
                name="name"
                bind:value={$exerciseModal.exercise.name}
                class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                placeholder="Enter a name"
                required
            />
        </Label>

        <Label class="space-y-1 text-sm text-primaryText">
            <span>Notes</span>
            <Input
                name="notes"
                bind:value={$exerciseModal.exercise.notes}
                class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                placeholder="Enter notes"
            />
        </Label>

        <Button
            type="submit"
            class="w-full py-2 bg-burnt-umber text-primaryText font-semibold rounded-md"
            on:click={submitExercise}
        >
            {#if $exerciseModal.mode == "edit"}
                Save
            {:else}
                Add Exercise
            {/if}
        </Button>

        {#if $exerciseModal.mode == "edit"}
            <Button
                type="button"
                class="w-full py-2 bg-red-600 hover:bg-red-700 text-primaryText font-semibold rounded-md"
                on:click={removeExercise}
            >
                Delete
            </Button>
        {/if}
    </div>
</Modal>
