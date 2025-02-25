<script lang="ts">
    import { goto } from "$app/navigation";
    import { workouts, workoutId } from "$lib/store";
</script>

<div class="bg-black-bean p-6 rounded-lg shadow-md">
    {#each $workouts as workout}
        <div class="border-b border-thistle last:border-none">
            <button
                on:click={() => {
                    workoutId.set(workout.id);
                    goto("/workout");
                }}
                class="block w-full text-left text-xl p-4 text-thistle hover:text-plum hover:bg-seal-brown transition duration-300 rounded-md"
            >
                <span class="block font-semibold text-burnt-umber"
                    >{workout.date}</span
                >
                <span class="block text-gray-200">{workout.notes}</span>
            </button>
        </div>
    {/each}
</div>
