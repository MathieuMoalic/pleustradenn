<script lang="ts">
    import { Toast } from "flowbite-svelte";
    import { alerts } from "$lib/alert";
</script>

{#if $alerts.length > 0}
    <div class="fixed right-4 top-2 z-50">
        {#each $alerts as alert}
            <Toast
                class="h-auto rounded opacity-75 text-gray-900 p-2 m-2 font-extrabold {alert.color}"
                dismissable={false}
            >
                {alert.message}
            </Toast>
        {/each}
    </div>
{/if}
