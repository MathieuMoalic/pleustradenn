<script lang="ts">
    import { addAlert } from "$lib/alert";
    import { sessionModal } from "$lib/store";
    import { Button, Modal, Label, Input } from "flowbite-svelte";
    import { getApi } from "$lib/auth";
    import { Datepicker } from "flowbite-svelte";
    import { onMount } from "svelte";

    async function submitSession() {
        if ($sessionModal.mode == "edit") {
            getApi()
                .sessionUpdate($sessionModal.sessionID, $sessionModal.session)
                .then((_) => {
                    $sessionModal.isOpen = false;
                    $sessionModal.sessionID = -1;
                })
                .catch((res) => {
                    addAlert(
                        `Failed to update the session: ${res.error.detail}`,
                        "error",
                    );
                });
            return;
        } else if ($sessionModal.mode == "add") {
            if (!$sessionModal.session.notes) {
                $sessionModal.session.notes = "";
            }
            getApi()
                .sessionCreate({
                    date: $sessionModal.selectedDate
                        .toISOString()
                        .split("T")[0],
                    notes: $sessionModal.session.notes,
                })
                .then((_) => {
                    $sessionModal.isOpen = false;
                    $sessionModal.sessionID = -1;
                    $sessionModal.session = {
                        date: "",
                        notes: "",
                    };
                })
                .catch((res) => {
                    addAlert(
                        `Failed to create the session: ${res.error.detail}`,
                        "error",
                    );
                });
        }
    }

    async function removeSession() {
        getApi()
            .sessionDelete($sessionModal.sessionID)
            .then((_) => {
                $sessionModal.isOpen = false;
                $sessionModal.sessionID = -1;
            })
            .catch((res) => {
                addAlert(
                    `Failed to delete the session: ${res.error.detail}`,
                    "error",
                );
            });
    }
</script>

<Modal
    bind:open={$sessionModal.isOpen}
    size="xs"
    outsideclose
    class="bg-plum text-primaryText rounded-lg"
>
    <div
        class="flex flex-col space-y-4 p-3 rounded-lg shadow-lg bg-primaryBg text-primaryText"
        role="dialog"
    >
        <h3 class="text-lg font-semibold text-primaryText">
            {#if $sessionModal.mode == "edit"}
                Edit Session
            {:else}
                Add a New Session
            {/if}
        </h3>

        <div class="mb-64 md:w-1/2">
            <Datepicker
                bind:value={$sessionModal.selectedDate}
                inline
                color="red"
            />
        </div>

        <Label class="space-y-1 text-sm text-primaryText">
            <span>Notes</span>
            <Input
                name="notes"
                bind:value={$sessionModal.session.notes}
                class="bg-secondaryBg border-inputBorderColor rounded-md text-primaryText"
                placeholder="Enter notes"
            />
        </Label>

        <Button
            type="submit"
            class="w-full py-2 bg-burnt-umber text-primaryText font-semibold rounded-md"
            on:click={submitSession}
        >
            {#if $sessionModal.mode == "edit"}
                Save
            {:else}
                Add Session
            {/if}
        </Button>

        {#if $sessionModal.mode == "edit"}
            <Button
                type="button"
                class="w-full py-2 bg-red-600 hover:bg-red-700 text-primaryText font-semibold rounded-md"
                on:click={removeSession}
            >
                Delete
            </Button>
        {/if}
    </div>
</Modal>
