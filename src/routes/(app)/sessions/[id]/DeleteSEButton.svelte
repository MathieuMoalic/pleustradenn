<script lang="ts">
    import { enhance } from "$app/forms";
    export let SE;
</script>

<form method="POST" action="?/delete_session_exercise" use:enhance>
    <input type="hidden" name="id" value={SE.id || ""} />
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
            ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m14 0H5m2 0V5a2 2 0 012-2h6a2 2 0 012 2v2"
            ></path></svg
        >
    </button>
</form>
