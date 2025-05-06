<script lang="ts">
    import { goto } from "$app/navigation";

    export let exercise_id: number;
</script>

<button
    type="button"
    class="bg-seal-brown text-thistle font-semibold p-2 rounded-md shadow-md hover:bg-burnt-umber transition duration-200"
    on:click={() => goto(`/exercises?edit=${exercise_id}`)}
    aria-label="Edit exercise"
>
    <svg
        class="w-4 h-4"
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
