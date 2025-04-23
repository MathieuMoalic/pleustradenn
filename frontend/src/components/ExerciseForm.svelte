<script lang="ts">
    import { Label, Input, Button } from "flowbite-svelte";
    import { page } from "$app/state";
    export let ex = {
        name: "",
        notes: "",
        recommended_sets: "",
        recommended_reps_min: "",
        recommended_reps_max: "",
        recommended_rest_seconds: "",
    };
</script>

<form method="POST" class="space-y-5 text-white">
    <label>
        <span>Name</span>
        <Input name="name" bind:value={ex.name} class="modal-input" required />
    </label>

    <label>
        <span>Notes</span>
        <Input name="notes" bind:value={ex.notes} class="modal-input" />
    </label>

    <label>
        <span>Recommended Sets</span>
        <Input
            name="recommended_sets"
            bind:value={ex.recommended_sets}
            class="modal-input"
        />
    </label>

    <label>
        <span>Recommended reps min</span>
        <Input
            name="recommended_reps_min"
            bind:value={ex.recommended_reps_min}
            class="modal-input"
        />
    </label>

    <label>
        <span>Recommended reps max</span>
        <Input
            name="recommended_reps_max"
            bind:value={ex.recommended_reps_max}
            class="modal-input"
        />
    </label>

    <label>
        <span>Recommended rest in seconds</span>
        <Input
            name="recommended_rest_seconds"
            bind:value={ex.recommended_rest_seconds}
            class="modal-input"
        />
    </label>

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
                Add {ex.name}
            </Button>
        {/if}
    </div>
</form>

<style>
    label {
        @apply text-sm text-gray-300 font-bold mt-3;
    }
</style>
