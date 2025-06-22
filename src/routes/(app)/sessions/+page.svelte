<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PageData, ActionData } from "./$types";
    import { slide } from "svelte/transition";
    import { enhance } from "$app/forms";
    import type { SubmitFunction } from "@sveltejs/kit";

    import SessionForm from "./SessionForm.svelte";
    import Navbar from "$components/Navbar.svelte";
    import { t } from "$lib/stores/i18n";
    import Plus from "$components/icons/Plus.svelte";
    import Clone from "$components/icons/Clone.svelte";
    import Edit from "$components/icons/Edit.svelte";
    import { addAlert } from "$lib/client/alert";

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

    const handleEnhance: SubmitFunction = () => {
        return async ({ result }) => {
            switch (result.type) {
                case "success": {
                    sessions = result.data?.sessions ?? [];
                    break;
                }

                // if server returns`fail(...)`
                case "failure": {
                    addAlert(result.data?.error ?? "Unknown error", "error");
                    break;
                }
            }
        };
    };
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
            <Plus
                className={`w-4 h-4 transition-transform duration-300 ${addingSession ? "rotate-45" : ""}`}
            />
        </button>
    </div>
</Navbar>

<section class="">
    <form method="POST" use:enhance={handleEnhance}>
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
                            <button
                                type="submit"
                                formaction="?/clone"
                                formmethod="POST"
                                name="id"
                                value={session.id}
                                class="flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
                                aria-label="Clone session"
                            >
                                <Clone />
                            </button>
                            <button
                                type="button"
                                class="flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
                                on:click={() => {
                                    toggleExpand(session.id);
                                }}
                                aria-label="Edit session"
                            >
                                <Edit />
                            </button>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </form>
</section>
