<script lang="ts">
    export let session_id: number;
    export let toggleExpand: (sessionId: number) => void;
</script>

<button
    type="button"
    class="flex items-center justify-center bg-plum text-black-bean p-2 rounded-md"
    on:click={() => {
        toggleExpand(session_id);
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
