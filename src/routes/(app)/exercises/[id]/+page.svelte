<script lang="ts">
    import type { PageData } from "./$types";
    export let data: PageData;
    import Menu from "$components/Menu.svelte";
    import { t } from "$lib/stores/i18n";

    function getDate(date: Date): string {
        return new Date(date).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    }
    function getTime(date: Date): string {
        return new Date(date).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    }
</script>

<Menu name={$t("log")} />
<h2 class="text-xl font-semibold text-thistle m-2 text-center">
    {data.exercise?.name}
</h2>

{#each data.sets as setGroup}
    <div
        class="bg-burnt-umber border border-seal-brown rounded-md p-4 mb-4 shadow-sm m-2"
    >
        <h3 class="text-lg font-semibold text-thistle mb-2">
            {getDate(setGroup[0].created_at)}
        </h3>

        {#each setGroup as set}
            <div
                class="text-thistle text-sm py-1 border-b border-seal-brown last:border-b-0"
            >
                {getTime(set.created_at)} –
                <span class="font-semibold">{set.reps}</span> x
                <span class="font-semibold">{set.intensity}</span>
            </div>
        {/each}
    </div>
{/each}
