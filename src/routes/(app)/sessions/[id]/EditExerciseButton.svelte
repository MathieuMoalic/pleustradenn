<script lang="ts">
    import { goto } from "$app/navigation";
    import type { SessionExercise } from "@prisma/client";

    export let SE: SessionExercise;
</script>

<button
    type="button"
    class={`font-semibold p-1.5 rounded-md shadow-md transition duration-200 ${
        SE.completed
            ? "bg-emerald-700 text-white hover:bg-emerald-600"
            : "bg-seal-brown text-thistle hover:bg-burnt-umber"
    }`}
    on:click={() => goto(`/exercises?edit=${SE.id}`)}
    aria-label="Edit exercise"
>
    <svg
        class="w-3 h-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 3.732z"
        />
    </svg>
</button>
