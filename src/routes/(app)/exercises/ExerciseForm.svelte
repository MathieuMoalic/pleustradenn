<script lang="ts">
    import type { ExerciseCategory, Exercise } from "@prisma/client";
    import { enhance } from "$app/forms";

    export let ex: Exercise;
    export let categories: ExerciseCategory[] = [];
    export let toggleExpand: (exerciseId: number) => void;

    let selected_category_id: number =
        categories.find((c) => c.id === ex.category_id)?.id ?? 1;
</script>

<form
    method="POST"
    class="space-y-5 text-plum p-3 pt-0"
    use:enhance
    on:submit={() => toggleExpand(ex.id)}
>
    <input type="hidden" name="id" value={ex.id} />
    <input type="hidden" name="category_id" value={selected_category_id} />

    <div>
        <label for="name" class="block text-sm font-medium text-thistle mb-1"
            >Name</label
        >
        <input
            type="text"
            id="name"
            name="name"
            bind:value={ex.name}
            required
            class="w-full rounded-md border border-burnt-umber bg-seal-brown text-thistle shadow-sm focus:border-plum focus:ring-plum sm:text-sm p-2"
        />
    </div>

    <div>
        <label
            for="intensity_unit"
            class="block text-sm font-medium text-thistle mb-1"
            >Intensity Unit</label
        >
        <input
            type="text"
            id="intensity_unit"
            name="intensity_unit"
            bind:value={ex.intensity_unit}
            required
            class="w-full rounded-md border border-burnt-umber bg-seal-brown text-thistle shadow-sm focus:border-plum focus:ring-plum sm:text-sm p-2"
        />
    </div>

    <div>
        <label for="notes" class="block text-sm font-medium text-thistle mb-1"
            >Notes</label
        >
        <textarea
            id="notes"
            name="notes"
            bind:value={ex.notes}
            rows="3"
            class="w-full rounded-md border border-burnt-umber bg-seal-brown text-thistle shadow-sm focus:border-plum focus:ring-plum sm:text-sm p-2"
        ></textarea>
    </div>

    <ul class="py-1 flex flex-wrap gap-1 justify-center">
        {#each categories as c (c.id)}
            <li>
                <button
                    type="button"
                    on:click={() => (selected_category_id = c.id)}
                    class={`text-left px-4 py-2 text-sm text-plum rounded
                        ${
                            selected_category_id === c.id
                                ? "bg-seal-brown/40 text-thistle"
                                : "bg-seal-brown hover:bg-seal-brown/50 hover:text-thistle"
                        }`}
                >
                    {c.name}
                </button>
            </li>
        {/each}
    </ul>

    <div class="flex justify-between gap-2 pt-4">
        {#if ex.id >= 0}
            <button
                type="submit"
                formaction="?/update"
                class="w-full rounded-md bg-green-400/60 py-2 px-4 text-thistle hover:bg-green-400/80 focus:outline-none focus:ring-2 focus:ring-burnt-umber focus:ring-offset-2 focus:ring-offset-seal-brown"
            >
                Save
            </button>
            <button
                type="submit"
                class="w-full rounded-md bg-red-500/60 py-2 px-4 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-seal-brown"
                formaction="?/delete"
                formmethod="POST"
            >
                Delete
            </button>
        {:else}
            <button
                type="submit"
                formaction="?/create"
                class="w-full rounded-md bg-plum py-2 px-4 text-seal-brown hover:bg-plum/90 focus:outline-none focus:ring-2 focus:ring-plum focus:ring-offset-2 focus:ring-offset-seal-brown"
            >
                Add {ex.name || "Exercise"}
            </button>
        {/if}
    </div>
</form>
