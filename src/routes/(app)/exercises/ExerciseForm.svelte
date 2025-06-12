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
    class="space-y-2 text-plum p-3 pt-0"
    use:enhance
    on:submit={() => toggleExpand(ex.id)}
>
    <input type="hidden" name="id" value={ex.id} />
    <input type="hidden" name="category_id" value={selected_category_id} />

    <!-- English Name -->
    <div class="flex items-center gap-2">
        <label
            for="name"
            class="w-24 text-sm text-thistle text-center flex justify-center"
            >🇬🇧</label
        >

        <input
            id="name"
            name="name"
            type="text"
            bind:value={ex.name}
            required
            class="flex-1 rounded border border-burnt-umber bg-seal-brown text-thistle p-1 sm:text-sm"
        />
    </div>

    <!-- Polish Name -->
    <div class="flex items-center gap-2">
        <label
            for="name_pl"
            class="w-24 text-sm text-thistle text-center flex justify-center"
            >🇵🇱</label
        >
        <input
            id="name_pl"
            name="name_pl"
            type="text"
            bind:value={ex.name_pl}
            class="flex-1 rounded border border-burnt-umber bg-seal-brown text-thistle p-1 sm:text-sm"
        />
    </div>

    <!-- French Name -->
    <div class="flex items-center gap-2">
        <label
            for="name_fr"
            class="w-24 text-sm text-thistle text-center flex justify-center"
            >🇫🇷</label
        >
        <input
            id="name_fr"
            name="name_fr"
            type="text"
            bind:value={ex.name_fr}
            class="flex-1 rounded border border-burnt-umber bg-seal-brown text-thistle p-1 sm:text-sm"
        />
    </div>

    <!-- Intensity Unit -->
    <div class="flex items-center gap-2">
        <label
            for="intensity_unit"
            class="w-24 text-sm text-thistle text-center flex justify-center"
            >Unit</label
        >
        <input
            id="intensity_unit"
            name="intensity_unit"
            type="text"
            bind:value={ex.intensity_unit}
            required
            class="flex-1 rounded border border-burnt-umber bg-seal-brown text-thistle p-1 sm:text-sm"
        />
    </div>

    <!-- Notes -->
    <div class="flex items-center gap-2">
        <label
            for="notes"
            class="w-24 text-sm text-thistle text-center flex justify-center"
            >Notes</label
        >
        <input
            id="notes"
            name="notes"
            type="text"
            bind:value={ex.notes}
            class="flex-1 rounded border border-burnt-umber bg-seal-brown text-thistle p-1 sm:text-sm"
        />
    </div>

    <!-- Categories -->
    <ul class="flex flex-wrap gap-1 pt-1 text-center justify-center">
        {#each categories as c (c.id)}
            <li>
                <button
                    type="button"
                    on:click={() => (selected_category_id = c.id)}
                    class={`px-3 py-1 text-sm rounded ${
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

    <!-- Action Buttons -->
    <div class="flex justify-between gap-2 pt-3">
        {#if ex.id >= 0}
            <button
                type="submit"
                formaction="?/update"
                class="flex-1 rounded bg-green-400/60 py-1 px-3 text-thistle hover:bg-green-400/80"
            >
                Save
            </button>
            <button
                type="submit"
                class="flex-1 rounded bg-red-500/60 py-1 px-3 text-white hover:bg-red-700"
                formaction="?/delete"
                formmethod="POST"
            >
                Delete
            </button>
        {:else}
            <button
                type="submit"
                formaction="?/create"
                class="w-full rounded bg-plum py-1 px-3 text-seal-brown hover:bg-plum/90"
            >
                Add {ex.name || "Exercise"}
            </button>
        {/if}
    </div>
</form>
