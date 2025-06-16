<script lang="ts">
    import { goto } from "$app/navigation";
    export let SE: { exercise: { id: number }; completed: boolean };

    function goToExercise() {
        goto(`/exercises/${SE.exercise.id}`);
    }
</script>

<button
    type="button"
    on:click={goToExercise}
    class={`p-1.5 rounded-md shadow-md transition duration-200 ${
        SE.completed
            ? "bg-emerald-700 text-white hover:bg-emerald-600"
            : "bg-seal-brown text-thistle hover:bg-burnt-umber"
    }`}
    aria-label="Go to log"
>
    <svg
        class="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <line
            x1="8"
            y1="9"
            x2="16"
            y2="9"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <line
            x1="8"
            y1="13"
            x2="16"
            y2="13"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <line
            x1="8"
            y1="17"
            x2="14"
            y2="17"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</button>
