<script lang="ts">
    import { PlusOutline } from "flowbite-svelte-icons";
    export let name = "";
    export let onclick = (_: any) => {};
</script>

<button
    on:click={() => onclick(null)}
    class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition duration-200 flex items-center space-x-5"
>
    <PlusOutline class="mr-2" /> Add {name}
</button>
