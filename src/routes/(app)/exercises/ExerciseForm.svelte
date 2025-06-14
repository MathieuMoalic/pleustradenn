<script lang="ts">
    import type { Exercise } from "@prisma/client";
    import { enhance } from "$app/forms";
    import { t, cs } from "$lib/stores/i18n";
    export let ex: Exercise;
    export let toggleExpand: (exerciseId: number) => void;

    let selected_category: string = "other";
</script>

<form
    method="POST"
    class="space-y-2 text-plum p-3 pt-0"
    use:enhance
    on:submit={() => toggleExpand(ex.id)}
>
    <input type="hidden" name="id" value={ex.id} />
    <input type="hidden" name="category" value={selected_category} />

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
            >{$t("unit")}</label
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
            >{$t("notes")}</label
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
        {#each Object.entries($cs) as [key, label]}
            <li>
                <button
                    type="button"
                    on:click={() => (selected_category = key)}
                    class={`px-3 py-1 text-sm rounded ${
                        selected_category === key
                            ? "bg-seal-brown/40 text-thistle"
                            : "bg-seal-brown hover:bg-seal-brown/50 hover:text-thistle"
                    }`}
                >
                    {label}
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
                {$t("save")}
            </button>
            <button
                type="submit"
                class="flex-1 rounded bg-red-500/60 py-1 px-3 text-white hover:bg-red-700"
                formaction="?/delete"
                formmethod="POST"
            >
                {$t("delete")}
            </button>
        {:else}
            <button
                type="submit"
                formaction="?/create"
                class="w-full rounded bg-plum py-1 px-3 text-seal-brown hover:bg-plum/90"
            >
                {$t("add")}
                {ex.name || "Exercise"}
            </button>
        {/if}
    </div>
</form>
