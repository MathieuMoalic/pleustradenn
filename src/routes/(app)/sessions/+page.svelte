<script lang="ts">
    import { goto } from "$app/navigation";
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
                            <input type="hidden" name="id" value={session.id} />
                            <button
                                type="submit"
                                formaction="?/clone"
                                formmethod="POST"
                                class="flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
                                aria-label="Clone session"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M8 8H7.2C6.0799 8 5.51984 8 5.09202 8.21799C4.71569 8.40973 4.40973 8.71569 4.21799 9.09202C4 9.51984 4 10.0799 4 11.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H12.8C13.9201 20 14.4802 20 14.908 19.782C15.2843 19.5903 15.5903 19.2843 15.782 18.908C16 18.4802 16 17.9201 16 16.8V16M11.2 16H16.8C17.9201 16 18.4802 16 18.908 15.782C19.2843 15.5903 19.5903 15.2843 19.782 14.908C20 14.4802 20 13.9201 20 12.8V7.2C20 6.0799 20 5.51984 19.782 5.09202C19.5903 4.71569 19.2843 4.40973 18.908 4.21799C18.4802 4 17.9201 4 16.8 4H11.2C10.0799 4 9.51984 4 9.09202 4.21799C8.71569 4.40973 8.40973 4.71569 8.21799 5.09202C8 5.51984 8 6.07989 8 7.2V12.8C8 13.9201 8 14.4802 8.21799 14.908C8.40973 15.2843 8.71569 15.5903 9.09202 15.782C9.51984 16 10.0799 16 11.2 16Z"
                                        stroke="#000000"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </button>
                        </form>
                        <button
                            type="button"
                            class="flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
                            on:click={() => {
                                toggleExpand(session.id);
                            }}
                            aria-label="Edit session"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
                                />
                            </svg>
                        </button>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</section>
