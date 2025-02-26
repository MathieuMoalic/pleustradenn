<script lang="ts">
    import { Button, Navbar, NavBrand } from "flowbite-svelte";
</script>

<div class="relative px-8 pb-16">
    <Navbar
        class="px-4 py-3 fixed w-full z-20 top-0 start-0 border-b border-thistle bg-black-bean shadow-md"
    >
        <NavBrand
            href="/"
            class="text-plum hover:text-thistle transition duration-300"
        >
            <span class="self-center whitespace-nowrap text-xl font-semibold">
                Sessions
            </span>
        </NavBrand>
        <NavBrand
            href="/exercises"
            class="text-plum hover:text-thistle transition duration-300"
        >
            <span class="self-center whitespace-nowrap text-xl font-semibold">
                Exercises
            </span>
        </NavBrand>
        <Button
            href="/login"
            class="text-plum hover:text-thistle transition duration-300"
            on:click={() => localStorage.removeItem("token")}
        >
            Logout
        </Button>
    </Navbar>
</div>
