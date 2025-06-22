<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";

    import Bin from "$components/icons/Bin.svelte";
    import Log from "$components/icons/Log.svelte";
    import TickedBox from "$components/icons/TickedBox.svelte";
    import UntickedBox from "$components/icons/UntickedBox.svelte";
    import Add from "$components/icons/Plus.svelte";

    export let SE: {
        exercise: { id: number };
        completed: boolean;
        id: number;
        session_id: number;
        sets: { id: number }[];
    };

    let className = "h-3 w-3";
    let buttonClass =
        "p-1.5 rounded-md shadow-xl transition duration-200 bg-seal-brown text-thistle";
</script>

<div class="px-1 ml-1 py-1 bg-white/5 rounded-r-md flex flex-col gap-1">
    <form method="POST" action="?/create_set" use:enhance>
        <input type="hidden" name="session_id" value={SE.session_id} />
        <input type="hidden" name="exercise_id" value={SE.exercise.id || ""} />
        <input type="hidden" name="session_exercise_id" value={SE.id || ""} />
        <button type="submit" class={buttonClass} aria-label="Add set">
            <Add {className} />
        </button>
    </form>

    {#if !(SE.sets[0].id <= 0)}
        <form method="POST" action="?/update_session_exercise" use:enhance>
            <input type="hidden" name="id" value={SE.id} />
            <input type="hidden" name="completed" value={SE.completed} />

            <button
                type="submit"
                class={buttonClass}
                aria-label={SE.completed
                    ? "Mark as incomplete"
                    : "Mark as complete"}
                on:click={() => (SE.completed = !SE.completed)}
            >
                {#if SE.completed}
                    <TickedBox {className} />
                {:else}
                    <UntickedBox {className} />
                {/if}
            </button>
        </form>
    {/if}

    <button
        type="button"
        on:click={() => goto(`/exercises/${SE.exercise.id}`)}
        class={buttonClass}
        aria-label="Go to log"
    >
        <Log {className} />
    </button>

    <form method="POST" action="?/delete_session_exercise" use:enhance>
        <input type="hidden" name="id" value={SE.id || ""} />
        <button type="submit" class={buttonClass} aria-label="Add set">
            <Bin {className} />
        </button>
    </form>
</div>
