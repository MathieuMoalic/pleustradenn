<script lang="ts">
    import { onMount } from "svelte";

    let time = 0; // time in milliseconds
    let interval: NodeJS.Timeout | null = null;

    function formatTime(t: number) {
        const minutes = String(Math.floor(t / 60000)).padStart(2, "0");
        const seconds = String(Math.floor((t % 60000) / 1000)).padStart(2, "0");
        const milliseconds = String(Math.floor((t % 1000) / 10)).padStart(
            2,
            "0",
        );
        return `${minutes}:${seconds}:${milliseconds}`;
    }

    function startClock() {
        if (interval) return;
        const start = Date.now() - time;
        interval = setInterval(() => {
            time = Date.now() - start;
        }, 10);
    }

    onMount(() => {
        startClock();
    });
</script>

<div
    class="flex flex-col items-center justify-center bg-seal-brown/90 border border-burnt-umber rounded-md shadow-md p-6 w-full max-w-md mx-auto"
>
    <div
        class="text-thistle text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider"
    >
        {formatTime(time)}
    </div>
</div>
