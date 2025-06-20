<script lang="ts">
    import { alerts } from "$lib/client/alert";
</script>

{#if $alerts.length > 0}
    <div class="fixed right-4 top-2 z-50">
        {#each $alerts as alert}
            <div
                class={`h-auto rounded opacity-90 p-2 m-2 font-extrabold border ${
                    alert.type === "success"
                        ? "bg-green-700 border-green-900"
                        : "bg-red-700 border-red-900"
                }`}
            >
                {alert.message}
            </div>
        {/each}
    </div>
{/if}
