<script lang="ts">
	import { goto } from "$app/navigation";
	import Alert from "$components/Alert.svelte";
	import { workouts } from "$lib/store";
</script>

<Alert />

<div class="text-gray-200">
	{#each $workouts as workout}
		<div class="block text-xl p-4">
			<button on:click={() => goto(`/workout/${workout.id}`)}>
				{workout.date}
				{workout.notes}
			</button>
		</div>
	{/each}
</div>
