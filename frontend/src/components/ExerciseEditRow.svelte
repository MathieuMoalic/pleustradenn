<script lang="ts">
    import type { ExerciseRead, ExerciseUpdate } from "$lib/Api";
    import { getApi } from "$lib/auth";
    import { exercises } from "$lib/store";
    import { addAlert } from "$lib/alert";

    export let ex: ExerciseRead;
    export let editingId: number | null;

    let editData: ExerciseUpdate = {
        name: ex.name,
        notes: ex.notes,
    };

    function saveEdits(exerciseId: number) {
        getApi()
            .exerciseUpdate(exerciseId, editData)
            .then((res) => {
                exercises.update((exs) =>
                    exs.map((ex) => (ex.id === exerciseId ? res.data : ex)),
                );
                addAlert("Exercise updated successfully!", "success");
            })
            .catch((err) => addAlert(err, "error"))
            .finally(() => {
                editingId = null;
            });
    }
</script>

<tr class="bg-gray-100">
    <td colspan="4" class="border p-2">
        <div class="grid grid-cols-2 gap-2 mb-2">
            <input
                class="border p-2 rounded"
                placeholder="Name"
                bind:value={editData.name}
            />
            <input
                class="border p-2 rounded"
                placeholder="notes"
                bind:value={editData.notes}
            />
        </div>
        <div class="flex space-x-2">
            <button
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                on:click={() => saveEdits(ex.id)}
            >
                Save
            </button>
            <button
                class="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                on:click={() => (editingId = null)}
            >
                Cancel
            </button>
        </div>
    </td>
</tr>
