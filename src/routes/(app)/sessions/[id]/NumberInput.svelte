<script lang="ts">
    export let value: number;
    export let name: string;
    export let id: number;
    export let form: HTMLFormElement;
</script>

<input
    type="number"
    id={`${name}-expanded-${id}`}
    {name}
    bind:value
    min="0"
    step="0.1"
    class="w-14 bg-transparent border-plum focus:border-thistle focus:outline-none text-thistle text-center text-base rounded-md"
    on:change={() => form?.requestSubmit()}
/>

<style>
    /* Hide arrows for number inputs (Chrome, Safari, Edge) */
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Hide arrows for number inputs (Firefox) */
    input[type="number"] {
        -moz-appearance: textfield;
        appearance: textfield;
    }
</style>
