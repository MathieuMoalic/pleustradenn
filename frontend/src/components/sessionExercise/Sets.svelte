<script lang="ts">
    import type { SessionExerciseRead } from "$lib/api";
    export let ex: SessionExerciseRead;
</script>

<div class="flex flex-col items-center gap-2">
    <div class="flex gap-1">
        {#each Array(ex.sets).fill(0) as _, i}
            <div
                class="w-3 h-3 rounded-full {i < ex.count
                    ? 'bg-green-500'
                    : 'bg-gray-300'}"
            ></div>
        {/each}
    </div>
</div>
