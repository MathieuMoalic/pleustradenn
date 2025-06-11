<script lang="ts">
    import { enhance } from "$app/forms";
    import type { SessionExercise } from "@prisma/client";
    export let SE: SessionExercise;
</script>

<form method="POST" action="?/create_set" use:enhance>
    <input type="hidden" name="session_id" value={SE.session_id} />
    <input type="hidden" name="exercise_id" value={SE.exercise_id || ""} />
    <input type="hidden" name="session_exercise_id" value={SE.id || ""} />
    <button
        type="submit"
        class={`p-1.5 rounded-md shadow-md transition duration-200 ${
            SE.completed
                ? "bg-emerald-700 text-white hover:bg-emerald-600"
                : "bg-seal-brown text-thistle hover:bg-burnt-umber"
        }`}
        aria-label="Add set"
    >
        <svg
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
            />
        </svg>
    </button>
</form>
