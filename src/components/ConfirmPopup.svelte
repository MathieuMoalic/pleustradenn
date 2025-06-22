<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { confirmStore } from "$lib/client/confirm";
    import { derived } from "svelte/store";

    const req = derived(confirmStore, (v) => v); // just re-export

    function close() {
        confirmStore.set(null);
    }
</script>

{#if $req}
    <!-- dimmed backdrop -->
    <div
        class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        in:fade
    >
        <!-- card -->
        <div
            class="bg-seal-brown/95 border border-thistle/40 rounded shadow-md p-6 w-[90%] max-w-md"
            in:fly={{ y: 20, duration: 180 }}
        >
            <p class="text-thistle mb-4">{$req.message}</p>

            <div class="flex justify-end gap-2">
                <button
                    class="px-3 py-1 rounded bg-green-700 text-thistle border border-thistle/40 hover:bg-green-800 transition"
                    on:click={() => {
                        $req.confirm();
                        close();
                    }}
                >
                    Confirm
                </button>
                <button
                    class="px-3 py-1 rounded bg-burnt-umber text-thistle border border-thistle/40 hover:bg-red-800 transition"
                    on:click={() => {
                        $req.cancel?.();
                        close();
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
{/if}
