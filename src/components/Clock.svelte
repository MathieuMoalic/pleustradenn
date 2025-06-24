<script lang="ts">
    import { onMount } from "svelte";

    let time = 0;
    let interval: NodeJS.Timeout | null = null;
    export let onclick: () => void = () => {};

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

<button
    on:click={onclick}
    class="flex flex-col items-center justify-center bg-seal-brown border border-burnt-umber rounded-md shadow-md p-2 w-full"
>
    <div
        class="text-thistle text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider"
    >
        {formatTime(time)}
    </div>
</button>
