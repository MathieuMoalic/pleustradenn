<script lang="ts">
    import "../app.css";
    import { Navbar, NavBrand } from "flowbite-svelte";
</script>

<div class="bg-gray-700 h-screen">
    <Navbar>
        <NavBrand href="/">
            <span class="self-center whitespace-nowrap text-xl font-semibold">
                Home
            </span>
        </NavBrand>
    </Navbar>

    <div class="max-w-[500px] mx-auto font-['Segoe_UI',sans-serif]">
        <slot></slot>
    </div>
</div>
