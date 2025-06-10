<script lang="ts">
    import type { Set } from "@prisma/client";

    export let set: Set;
    export let unit: string;
</script>

<span
    class="w-6 h-6 flex items-center justify-center text-thistle font-mono m-2 mr-1"
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-thistle"
        fill="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            d="M17 2v2h1a2 2 0 012 2v2a5 5 0 01-4 4.9V15h2v2H8v-2h2v-2.1A5 5 0 016 8V6a2 2 0 012-2h1V2h8zm-1 2H8v2a3 3 0 006 0V4z"
        />
    </svg>
</span>
<div
    class="flex items-center justify-between px-2 py-2 w-full bg-black-bean/70 rounded-md text-thistle text-sm"
>
    <div class="flex items-center gap-4 ml-1">
        {set.reps} x {set.intensity}{unit}
    </div>
</div>
