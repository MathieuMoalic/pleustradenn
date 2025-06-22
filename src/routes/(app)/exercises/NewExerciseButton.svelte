<script lang="ts">
    import Plus from "$components/icons/Plus.svelte";
    import { goto } from "$app/navigation";
</script>

<button
    class="bg-green-700 p-1 rounded text-thistle border border-thistle/40"
    on:click={() => goto("/exercises/new")}
>
    <Plus className="w-4 h-4" />
</button>
