<script lang="ts">
    import type { ExerciseCategory, Exercise } from "@prisma/client";

    export let ex: Exercise;
    export let categories: ExerciseCategory[] = [];

    let selected_category: ExerciseCategory | undefined = categories.find(
        (c) => c.id === ex.category_id,
    );

    // Fallback if the category isn't found or categories are empty
    if (!selected_category && categories.length > 0) {
        selected_category = categories[0];
    } else if (!selected_category && categories.length === 0) {
        console.warn("No exercise categories available.");
    }

    let dropdownOpen = false;

    function select_category(c: ExerciseCategory) {
        selected_category = c;
        dropdownOpen = false;
    }

    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
    }
</script>

<form method="POST" class="space-y-5 text-plum">
    <input type="hidden" name="id" value={ex.id} />
    <input type="hidden" name="category_id" value={selected_category?.id} />

    <div>
        <label for="name" class="block text-sm font-medium text-thistle mb-1"
            >Name</label
        >
        <input
            type="text"
            id="name"
            name="name"
            bind:value={ex.name}
            required
            class="w-full rounded-md border border-burnt-umber bg-black-bean text-thistle shadow-sm focus:border-plum focus:ring-plum sm:text-sm p-2"
        />
    </div>

    <div>
        <label
            for="intensity_unit"
            class="block text-sm font-medium text-thistle mb-1"
            >Intensity Unit</label
        >
        <input
            type="text"
            id="intensity_unit"
            name="intensity_unit"
            bind:value={ex.intensity_unit}
            required
            class="w-full rounded-md border border-burnt-umber bg-black-bean text-thistle shadow-sm focus:border-plum focus:ring-plum sm:text-sm p-2"
        />
    </div>

    <div>
        <label for="notes" class="block text-sm font-medium text-thistle mb-1"
            >Notes</label
        >
        <textarea
            id="notes"
            name="notes"
            bind:value={ex.notes}
            rows="3"
            class="w-full rounded-md border border-burnt-umber bg-black-bean text-thistle shadow-sm focus:border-plum focus:ring-plum sm:text-sm p-2"
        ></textarea>
    </div>

    <div class="relative">
        <label
            for="category-dropdown-button"
            class="block text-sm font-medium text-thistle mb-1">Category</label
        >
        <button
            type="button"
            id="category-dropdown-button"
            on:click={toggleDropdown}
            class="w-full flex justify-between items-center rounded-md border border-burnt-umber bg-black-bean text-thistle shadow-sm focus:outline-none focus:ring-2 focus:ring-plum sm:text-sm p-2"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
        >
            <span>{selected_category?.name ?? "Select Category"}</span>
            <svg
                class="w-5 h-5 transition-transform duration-200 {dropdownOpen
                    ? 'rotate-180'
                    : ''} text-plum"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                ></path>
            </svg>
        </button>

        {#if dropdownOpen}
            <div
                class="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-seal-brown ring-1 ring-burnt-umber ring-opacity-5 max-h-60 overflow-y-auto"
            >
                <ul class="py-1">
                    {#each categories as c (c.id)}
                        <li>
                            <button
                                type="button"
                                on:click={() => select_category(c)}
                                class="block w-full text-left px-4 py-2 text-sm text-plum hover:bg-burnt-umber hover:text-thistle"
                            >
                                {c.name}
                            </button>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>

    <div class="flex justify-between gap-2 pt-4">
        {#if ex.id >= 0}
            <button
                type="submit"
                formaction="?/update"
                class="w-full rounded-md bg-burnt-umber py-2 px-4 text-thistle hover:bg-burnt-umber/90 focus:outline-none focus:ring-2 focus:ring-burnt-umber focus:ring-offset-2 focus:ring-offset-seal-brown"
            >
                Save
            </button>
            <button
                type="submit"
                class="w-full rounded-md bg-red-600 py-2 px-4 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-seal-brown"
                formaction="?/delete"
                formmethod="POST"
            >
                Delete
            </button>
        {:else}
            <button
                type="submit"
                formaction="?/create"
                class="w-full rounded-md bg-plum py-2 px-4 text-black-bean hover:bg-plum/90 focus:outline-none focus:ring-2 focus:ring-plum focus:ring-offset-2 focus:ring-offset-seal-brown"
            >
                Add {ex.name || "Exercise"}
            </button>
        {/if}
    </div>
</form>
