<script lang="ts">
    import { enhance } from "$app/forms";

    export let id: number;
    export let completed: boolean = false;
</script>

<form method="POST" action="?/update_session_exercise" use:enhance>
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="completed" value={completed} />

    <button
        type="submit"
        class="bg-seal-brown text-thistle p-2 rounded-md shadow-md hover:bg-burnt-umber transition duration-200"
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        on:click={() => (completed = !completed)}
    >
        {#if completed}
            <svg
                class="w-5 h-5"
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
                class="w-5 h-5"
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
