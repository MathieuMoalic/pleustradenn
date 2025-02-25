<script lang="ts">
    import { exercises } from "$lib/store";
    import { getApi } from "$lib/auth";
    import { addAlert } from "$lib/alert";
    import ExerciseEditRow from "$components/ExerciseEditRow.svelte";

    let editingId: number | null = null;

    function deleteExercise(exerciseId: number) {
        getApi()
            .exerciseDelete(exerciseId)
            .then(() => {
                exercises.update((exs) =>
                    exs.filter((ex) => ex.id !== exerciseId),
                );
                addAlert("Exercise deleted successfully!", "success");
            })
            .catch((err) => addAlert(err, "error"));
    }
</script>

<section>
    <h2 class="text-xl font-semibold mb-3">Exercises</h2>
    <table class="min-w-full border-collapse border border-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th class="border p-2 text-left bg-burnt-umber">Name</th>
                <th class="border p-2 text-left bg-burnt-umber">Category</th>
                <th class="border p-2 text-left bg-burnt-umber">Muscle Group</th
                >
                <th class="border p-2 text-left bg-burnt-umber">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each $exercises as ex}
                <tr>
                    <td class="border p-2">{ex.name}</td>
                    <td class="border p-2">{ex.category}</td>
                    <td class="border p-2">{ex.muscle_group}</td>
                    <td class="border p-2 space-x-2">
                        <button
                            class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            on:click={() => (editingId = ex.id)}
                            disabled={editingId === ex.id}
                        >
                            Edit
                        </button>
                        <button
                            class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            on:click={() => deleteExercise(ex.id)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>

                {#if editingId === ex.id}
                    <ExerciseEditRow {ex} bind:editingId />
                {/if}
            {/each}
        </tbody>
    </table>
</section>
