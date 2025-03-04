<script lang="ts">
    import { Button, Navbar } from "flowbite-svelte";
    import { goto } from "$lib/page";
</script>

<div class="relative px-8 pb-16">
    <Navbar
        class="px-4 py-3 fixed w-full z-20 top-0 start-0 border-b border-thistle bg-black-bean shadow-md"
    >
        <Button
            class="text-plum hover:text-thistle transition duration-300"
            on:click={() => goto("session")}
        >
            <span class="self-center whitespace-nowrap text-xl font-semibold">
                Sessions
            </span>
        </Button>
        <Button
            class="text-plum hover:text-thistle transition duration-300"
            on:click={() => goto("exercise")}
        >
            <span class="self-center whitespace-nowrap text-xl font-semibold">
                Exercises
            </span>
        </Button>
        <Button
            class="text-plum hover:text-thistle transition duration-300"
            on:click={() => {
                localStorage.removeItem("token");
                goto("login");
            }}
        >
            Logout
        </Button>
    </Navbar>
</div>
