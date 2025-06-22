<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PageData } from "./$types";
    import { slide } from "svelte/transition";

    import EditButton from "./EditButton.svelte";
    import CloneButton from "./CloneButton.svelte";
    import SessionForm from "./SessionForm.svelte";
    import Navbar from "$components/Navbar.svelte";
    import { t } from "$lib/stores/i18n";
    import Plus from "$components/icons/Plus.svelte";

    export let data: PageData;

    let sessions = data.sessions;
    let expandedSessionId: number | null = null;

    function toggleExpand(sessionId: number) {
        if (expandedSessionId === sessionId) {
            expandedSessionId = null;
        } else {
            expandedSessionId = sessionId;
        }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let new_session = {
        id: -1,
        date: today,
        notes: "",
    };
    let addingSession = false;
</script>

<Navbar name={$t("sessions")}>
    <div slot="actions" class="flex gap-2">
        <button
            class="bg-green-700 p-1 rounded text-thistle border border-thistle/40"
            on:click={() => {
                addingSession = !addingSession;
                toggleExpand(-1);
            }}
        >
            <Plus className="w-4 h-4" />
        </button>
    </div>
</Navbar>

<section class="">
    <div class="flex flex-col gap-2 p-2">
        {#if addingSession}
            <div in:slide={{ duration: 200 }} out:slide={{ duration: 150 }}>
                <SessionForm session={new_session} {toggleExpand} />
            </div>
        {/if}

        {#each sessions as session}
            <div
                class="bg-burnt-umber text-white rounded-md shadow-sm w-full flex items-center gap-4"
            >
                {#if expandedSessionId === session.id}
                    <div
                        in:slide={{ duration: 200 }}
                        out:slide={{ duration: 150 }}
                        class="flex justify-center w-full p-4"
                    >
                        <SessionForm {session} {toggleExpand} />
                    </div>
                {:else}
                    <button
                        type="button"
                        on:click={() => goto(`/sessions/${session.id}`)}
                        class="flex flex-1 items-center gap-3 min-w-0 p-4 pr-0"
                    >
                        <div
                            class="text-sm font-semibold leading-tight whitespace-nowrap"
                        >
                            {session.date.toISOString().slice(0, 10)}
                        </div>
                        <div class="flex-grow min-w-0 text-left">
                            <p
                                class="text-xs text-thistle whitespace-nowrap overflow-hidden text-ellipsis"
                            >
                                {session.notes}
                            </p>
                        </div>
                    </button>

                    <div class="flex flex-shrink-0 ml-auto gap-2 mr-2">
                        <CloneButton session_id={session.id} />
                        <EditButton session_id={session.id} {toggleExpand} />
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</section>
