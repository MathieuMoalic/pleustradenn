<script lang="ts">
    import { Label, Input, Button, Datepicker } from "flowbite-svelte";
    import { page } from "$app/state";
    import type { CreateSessionFormData } from "$lib/types";
    export let session: CreateSessionFormData;
</script>

<form method="POST" class="space-y-4">
    <!-- <Header name="Session" /> -->

    <div class="mb-64 md:w-1/2">
        <Datepicker bind:value={session.date} inline color="red" />
        <input type="hidden" name="date" value={session.date} />
    </div>

    <Label class="space-y-1 text-sm">
        <span>Notes</span>
        <Input
            name="notes"
            bind:value={session.notes}
            class="modal-input"
            placeholder="Enter notes"
        />
    </Label>

    <div class="flex justify-between gap-2 pt-4">
        {#if page.params.id}
            <Button type="submit" formaction="?/update" class="btn-edit w-full"
                >Save</Button
            >
            <Button
                type="submit"
                class="btn-delete w-full"
                formaction="?/delete"
                formmethod="POST"
            >
                Delete
            </Button>
        {:else}
            <Button type="submit" formaction="?/create" class="btn-edit w-full">
                Add Session
            </Button>
        {/if}
    </div>
</form>
