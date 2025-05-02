<script lang="ts">
    export let session_id: number;
    export let exercise_id: number;
</script>

<form method="POST" action="?/create_set">
    <input type="hidden" name="session_id" value={session_id || ""} />
    <input type="hidden" name="exercise_id" value={exercise_id || ""} />

    <button
        type="submit"
        class="flex-shrink-0 text-plum hover:text-thistle focus:outline-none focus:ring-1 focus:ring-plum rounded-sm p-1"
        aria-label="Add set"
    >
        <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
            ></path></svg
        >
    </button>
</form>
