<script lang="ts">
    import { enhance } from "$app/forms";
    import { t, cs } from "$lib/stores/i18n";
    import { addAlert } from "$lib/client/alert";
    import type { SubmitFunction } from "@sveltejs/kit";
    import { goto } from "$app/navigation";

    export let ex: {
        notes: string;
        id: number;
        category: string;
        intensity_unit: string;
        name: string;
        name_fr: string | null;
        name_pl: string | null;
    };

    let selected_category: string = ex.category || "other";

    const handleEnhance: SubmitFunction = ({ submitter }) => {
        return async ({ result }) => {
            const action = submitter?.getAttribute("formaction");
            switch (result.type) {
                case "success": {
                    if (action?.includes("update")) {
                        addAlert(
                            `Exercise '${ex.name}' updated successfully`,
                            "success",
                        );
                        ex = result.data?.exercise ?? ex;
                        goto("/exercises");
                    } else if (action?.includes("delete")) {
                        addAlert(
                            `Exercise '${ex.name}' deleted successfully`,
                            "success",
                        );
                        goto("/exercises");
                    }
                    if (history.length > 1) {
                        history.back();
                        return;
                    }
                    break;
                }

                // if server returns`fail(...)`
                case "failure": {
                    addAlert(result.data?.error ?? "Unknown error", "error");

                    break;
                }
            }
        };
    };

    let redirectTo: string = "";
</script>

<form
    method="POST"
    class="space-y-2 text-plum bg-burnt-umber/80 border border-seal-brown rounded-md p-4 mb-4 shadow-sm m-2"
    use:enhance={handleEnhance}
>
    <input type="hidden" name="id" value={ex.id} />
    <input type="hidden" name="category" value={selected_category} />
    <input type="hidden" name="redirectTo" value={redirectTo} />
    <!-- English Name -->
    <div class="input-div">
        <label for="name">🇬🇧</label>

        <input
            id="name"
            name="name"
            type="text"
            bind:value={ex.name}
            required
            class="input-style"
        />
    </div>

    <!-- Polish Name -->
    <div class="input-div">
        <label for="name_pl">🇵🇱</label>
        <input
            id="name_pl"
            name="name_pl"
            type="text"
            bind:value={ex.name_pl}
            class="input-style"
        />
    </div>

    <!-- French Name -->
    <div class="input-div">
        <label for="name_fr">🇫🇷</label>
        <input
            id="name_fr"
            name="name_fr"
            type="text"
            bind:value={ex.name_fr}
            class="input-style"
        />
    </div>

    <!-- Intensity Unit -->
    <div class="input-div">
        <label for="intensity_unit">{$t("unit")}</label>
        <input
            id="intensity_unit"
            name="intensity_unit"
            type="text"
            bind:value={ex.intensity_unit}
            required
            class="input-style"
        />
    </div>

    <!-- Notes -->
    <div class="input-div">
        <label for="notes">{$t("notes")}</label>
        <input
            id="notes"
            name="notes"
            type="text"
            bind:value={ex.notes}
            class="input-style"
        />
    </div>

    <!-- Categories -->
    <ul class="grid grid-cols-2 gap-2 pt-1 text-center justify-center p-2">
        {#each Object.entries($cs) as [key, label]}
            <li>
                <button
                    type="button"
                    on:click={() => (selected_category = key)}
                    class={`px-3 py-1 w-full text-sm rounded flex items-center justify-center text-center ${
                        selected_category === key
                            ? "bg-burnt-umber text-thistle border"
                            : "bg-seal-brown/90 hover:bg-seal-brown/50 hover:text-thistle"
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

<style>
    .input-div {
        @apply flex items-center gap-2;
    }
    label {
        @apply w-12 flex-none text-sm text-thistle text-center flex justify-center;
    }
    .input-style {
        @apply w-full min-w-0 rounded border border-burnt-umber bg-seal-brown/90 text-thistle p-1 pl-2 mr-2;
    }
    .input-style:focus {
        @apply outline-none ring-2 ring-plum/50;
    }
</style>
