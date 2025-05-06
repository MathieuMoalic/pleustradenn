<script lang="ts">
    import { goto } from "$app/navigation";
    import { EditOutline, FileCopyOutline } from "flowbite-svelte-icons";
    import type { PageData } from "./$types";
    import SessionForm from "./SessionForm.svelte";
    import Menu from "$components/Menu.svelte";
    import { enhance } from "$app/forms";

    export let data: PageData;
    let sessions = data.sessions;

    let expandedSessionId: number | null = null;

    function toggleExpand(exerciseId: number) {
        if (expandedSessionId === exerciseId) {
            expandedSessionId = null;
        } else {
            expandedSessionId = exerciseId;
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

<Menu name="Sessions" bind:addButtonToggle={addingSession} />

<section>
    <div class="flex flex-col gap-2 p-2">
        {#if addingSession}
            <SessionForm session={new_session} />
        {/if}

        {#each sessions as session}
            <div
                class="bg-burnt-umber text-white rounded-md shadow-sm w-full flex items-center gap-4"
            >
                {#if expandedSessionId === session.id}
                    <div class="flex justify-center w-full p-4">
                        <SessionForm {session} />
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
                        <form method="POST" use:enhance>
                            <input
                                type="hidden"
                                name="session_id"
                                value={session.id}
                            />
                            <button
                                type="submit"
                                formaction="?/clone"
                                formmethod="POST"
                                class="flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
                            >
                                <FileCopyOutline class="w-4 h-4" />
                            </button>
                        </form>
                        <button
                            type="button"
                            class="flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
                            on:click={() => {
                                toggleExpand(session.id);
                            }}
                        >
                            <EditOutline class="w-4 h-4" />
                        </button>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</section>
