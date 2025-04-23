<script lang="ts">
    import { Button, Navbar } from "flowbite-svelte";
    import { goto } from "$app/navigation";
</script>

<nav class="pb-10">
    <Navbar
        class="py-1 fixed top-0 start-0 border-b border-thistle bg-black-bean"
    >
        <Button
            class="w-1/3 text-xl font-semibold text-plum"
            on:click={() => goto("/sessions")}
        >
            Sessions
        </Button>
        <Button
            class="w-1/3 text-xl font-semibold text-plum"
            on:click={() => goto("/exercises")}
        >
            Exercises
        </Button>
        <Button
            class="w-1/3 text-xl font-semibold text-plum"
            on:click={() => goto("/login")}>Logout</Button
        >
    </Navbar>
</nav>
