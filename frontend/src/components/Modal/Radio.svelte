<script lang="ts">
    import { Label } from "flowbite-svelte";
    import { CheckOutline, CloseOutline } from "flowbite-svelte-icons";
    export let value = false;

    function toggle() {
        value = !value;
    }
</script>

<Label class="space-y-1 text-sm">
    <div class="flex items-center space-x-3">
        <span class="font-medium">Success</span>
        <button
            type="button"
            class="relative w-16 h-8 flex items-center rounded-md transition-all duration-300
        {value ? 'bg-green-600' : 'bg-burnt-umber'} focus:outline-none"
            on:click={toggle}
            on:keydown={(e) =>
                e.key === "Enter" || e.key === " " ? toggle() : null}
            role="switch"
            aria-checked={value}
            aria-label="Toggle success"
        >
            <!-- Switch Knob -->
            <div
                class="absolute w-7 h-7 bg-white rounded-md transition-all duration-300 transform shadow-md flex items-center justify-center
        {value ? 'translate-x-8' : 'translate-x-1'}"
            >
                {#if value}
                    <CheckOutline class="w-5 h-5 text-green-600" />
                {:else}
                    <CloseOutline class="w-5 h-5 text-burnt-umber" />
                {/if}
            </div>
        </button>
    </div>
</Label>
