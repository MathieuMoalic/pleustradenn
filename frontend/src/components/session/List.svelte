<script lang="ts">
    import { goto } from "$app/navigation";
    import { sessions, sessionId } from "$lib/store";
</script>

<div class="bg-black-bean p-6 rounded-lg shadow-md">
    {#each $sessions as session}
        <div class="border-b border-thistle last:border-none">
            <button
                on:click={() => {
                    sessionId.set(session.id);
                    goto("/session");
                }}
                class="block w-full text-left text-xl p-4 text-thistle hover:text-plum hover:bg-seal-brown transition duration-300 rounded-md"
            >
                <span class="block font-semibold text-burnt-umber"
                    >{session.date}</span
                >
                <span class="block text-gray-200">{session.notes}</span>
            </button>
        </div>
    {/each}
</div>
