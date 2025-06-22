<script lang="ts">
    import Clone from "$components/icons/Clone.svelte";

    export let session_id: number;
</script>

<form method="POST">
    <input type="hidden" name="id" value={session_id} />
    <button
        type="submit"
        formaction="?/clone"
        formmethod="POST"
        class="flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
        aria-label="Clone session"
    >
        <Clone />
    </button>
</form>
