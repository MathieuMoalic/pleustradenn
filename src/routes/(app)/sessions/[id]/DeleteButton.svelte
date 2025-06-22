<script>
    import Bin from "$components/icons/Bin.svelte";
</script>

<button
    type="submit"
    formaction="?/delete_set"
    formmethod="POST"
    class="text-red-500 hover:text-red-400 rounded-sm"
    aria-label="Delete set"
>
    <Bin />
</button>
