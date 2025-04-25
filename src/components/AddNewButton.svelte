<script lang="ts">
    import { PlusOutline } from "flowbite-svelte-icons";
    export let name = "";
    export let onclick = (_: any) => {};
</script>

<button
    on:click={() => onclick(null)}
    class="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-5 bg-opacity-70"
>
    <PlusOutline class="mr-2" /> Add {name}
</button>
