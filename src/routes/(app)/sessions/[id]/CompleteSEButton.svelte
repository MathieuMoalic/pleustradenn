<script lang="ts">
    import { enhance } from "$app/forms";
    import type { SessionExercise } from "@prisma/client";

    export let SE: SessionExercise;
</script>

<form method="POST" action="?/update_session_exercise" use:enhance>
    <input type="hidden" name="id" value={SE.id} />
    <input type="hidden" name="completed" value={SE.completed} />

    <button
        type="submit"
        class={`p-1.5 rounded-sm shadow-md transition duration-200 ${
            SE.completed
                ? "bg-emerald-700 text-white hover:bg-emerald-600"
                : "bg-seal-brown text-thistle hover:bg-burnt-umber"
        }`}
        aria-label={SE.completed ? "Mark as incomplete" : "Mark as complete"}
        on:click={() => (SE.completed = !SE.completed)}
    >
        {#if SE.completed}
            <svg
                class="2-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    x="3"
                    y="3"
                    width="16"
                    height="16"
                    rx="2"
                    stroke-width="2"
                />
                <path
                    d="M7 12l3 3 7-7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                />
            </svg>
        {:else}
            <svg
                class="2-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    x="3"
                    y="3"
                    width="16"
                    height="16"
                    rx="2"
                    stroke-width="2"
                />
            </svg>
        {/if}
    </button>
</form>
