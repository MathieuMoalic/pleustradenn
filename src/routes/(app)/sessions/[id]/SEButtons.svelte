<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";

    import Bin from "$components/icons/Bin.svelte";
    import Log from "$components/icons/Log.svelte";
    import TickedBox from "$components/icons/TickedBox.svelte";
    import UntickedBox from "$components/icons/UntickedBox.svelte";
    import Add from "$components/icons/Plus.svelte";

    import { confirmable } from "$lib/client/confirm";
    import { exerciseNamei18n } from "$lib/stores/i18n";
    import Hamburger from "$components/icons/Hamburger.svelte";

    let formEl: HTMLFormElement;
    let deleteBtn: HTMLButtonElement;

    export let SE: {
        exercise: {
            id: number;
            name: string;
            name_fr: string | null;
            name_pl: string | null;
            notes: string;
            category: string;
            intensity_unit: string;
        };
        completed: boolean;
        id: number;
        session_id: number;
        sets: { id: number }[];
    };

    let showMenu = false;

    let svgIconClass = "h-4 w-4";
    const baseButtonClass =
        "p-1 rounded-md shadow-xl transition duration-200 text-thistle";

    $: buttonClass = `${baseButtonClass} ${SE.completed ? "bg-emerald-800" : "bg-seal-brown"}`;
</script>

<div class="px-1 ml-1 py-1 bg-white/5 rounded-r-md flex flex-col gap-1">
    <form method="POST" action="?/create_set" use:enhance>
        <input type="hidden" name="session_id" value={SE.session_id} />
        <input type="hidden" name="exercise_id" value={SE.exercise.id || ""} />
        <input type="hidden" name="session_exercise_id" value={SE.id || ""} />
        <button type="submit" class={buttonClass} aria-label="Add set">
            <Add className={svgIconClass} />
        </button>
    </form>
    <!-- Toggle Button -->
    <button
        type="button"
        class={buttonClass}
        aria-label="Toggle menu"
        on:click={() => (showMenu = !showMenu)}
    >
        <Hamburger className={svgIconClass} />
    </button>

    {#if showMenu}
        <div class="flex flex-col gap-1 mt-1">
            <!-- Add Set Button -->

            <!-- Mark Complete/Incomplete -->
            {#if !(SE.sets[0].id <= 0)}
                <form
                    method="POST"
                    action="?/update_session_exercise"
                    use:enhance
                >
                    <input type="hidden" name="id" value={SE.id} />
                    <input
                        type="hidden"
                        name="completed"
                        value={SE.completed}
                    />
                    <button
                        type="submit"
                        class={buttonClass}
                        aria-label={SE.completed
                            ? "Mark as incomplete"
                            : "Mark as complete"}
                        on:click={() => (SE.completed = !SE.completed)}
                    >
                        {#if SE.completed}
                            <TickedBox className={svgIconClass} />
                        {:else}
                            <UntickedBox className={svgIconClass} />
                        {/if}
                    </button>
                </form>
            {/if}

            <!-- Log Button -->
            <button
                type="button"
                on:click={() => goto(`/exercises/${SE.exercise.id}`)}
                class={buttonClass}
                aria-label="Go to log"
            >
                <Log className={svgIconClass} />
            </button>

            <!-- Delete Button -->
            <form
                method="POST"
                action="?/delete_session_exercise"
                use:enhance
                bind:this={formEl}
            >
                <button
                    bind:this={deleteBtn}
                    type="submit"
                    formaction="?/delete_session_exercise"
                    formmethod="POST"
                    class="hidden"
                    aria-hidden="true"
                    name="id"
                    value={SE.id}
                ></button>
                <button
                    type="button"
                    use:confirmable={{
                        message: `Are you sure you want to delete '${exerciseNamei18n(SE.exercise)}'?`,
                        onConfirm: () => formEl.requestSubmit(deleteBtn),
                    }}
                    class={buttonClass}
                    aria-label="Delete exercise"
                >
                    <Bin className={svgIconClass} />
                </button>
            </form>
        </div>
    {/if}
</div>
