<script lang="ts">
    import Trophy from "$components/icons/Trophy.svelte";
    import type { Set } from "@prisma/client";

    export let set: Set;
    export let unit: string;
</script>

<span
    class="w-6 h-6 flex items-center justify-center text-thistle font-mono m-2 mr-1"
>
    <Trophy />
</span>
<div
    class="flex items-center justify-between px-2 py-2 w-full bg-black-bean/70 rounded-md text-thistle text-sm"
>
    <div class="flex items-center gap-4 ml-1">
        {set.reps} x {set.intensity}{unit}
    </div>
</div>
