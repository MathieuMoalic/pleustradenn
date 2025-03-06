<script lang="ts">
    import { Button, Navbar } from "flowbite-svelte";
    import { goto } from "$lib/page";
</script>

<nav class="pb-10">
    <Navbar
        class="py-1 fixed top-0 start-0 border-b border-thistle bg-black-bean"
    >
        <Button
            class="w-1/3 text-xl font-semibold text-plum"
            on:click={() => goto("session")}
        >
            Sessions
        </Button>
        <Button
            class="w-1/3 text-xl font-semibold text-plum"
            on:click={() => goto("exercise")}
        >
            Exercises
        </Button>
        <Button
            class="w-1/3 text-xl font-semibold text-plum"
            on:click={() => goto("login")}>Logout</Button
        >
    </Navbar>
</nav>
