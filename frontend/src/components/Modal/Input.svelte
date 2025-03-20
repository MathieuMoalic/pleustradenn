<script lang="ts">
    import { Button, NumberInput, Label } from "flowbite-svelte";
    import { PlusOutline, MinusOutline } from "flowbite-svelte-icons";
    export let value = 0;
    export let name = "";
</script>

<Label class="space-y-1 text-sm">
    <div class="flex items-center space-x-3">
        <span class="font-medium w-28 text-left flex-shrink-0">{name}</span>
        <NumberInput
            style="-moz-appearance: textfield;"
            class="border-burnt-umber rounded-md bg-white w-full text-center"
            required
            bind:value
        />
        <Button
            on:click={() => (value = Math.max(0, value - 1))}
            class="w-10 h-10 bg-burnt-umber text-white rounded-md flex items-center justify-center text-lg font-bold"
        >
            <MinusOutline />
        </Button>
        <Button
            on:click={() => (value = value + 1)}
            class="w-10 h-10 bg-burnt-umber text-white rounded-md flex items-center justify-center text-lg font-bold"
        >
            <PlusOutline />
        </Button>
    </div>
</Label>
