<script>
    import { itemForm } from "$lib/store";
    import { Button } from "flowbite-svelte";
</script>

<Button
    size="lg"
    class="fixed bottom-4 right-4 bg-buttonBg"
    on:click={() => {
        $itemForm.mode = "add";
        $itemForm.item = {
            name: "",
            quantity: null,
            unit: "None",
            category_id: 1, // Default to "Other"
            notes: "",
        };
        $itemForm.isOpen = true;
    }}
>
    +
</Button>
