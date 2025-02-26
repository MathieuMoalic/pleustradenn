<script lang="ts">
    import type { ExerciseCreate } from "$lib/Api";
    import { getApi } from "$lib/auth";
    import { exercises } from "$lib/store";
    import { addAlert } from "$lib/alert";

    let newExercise: ExerciseCreate = {
        name: "",
        notes: "",
    };

    function createExercise() {
        getApi()
            .exerciseCreate(newExercise)
            .then((res) => {
                exercises.update((exs) => [...exs, res.data]);
                newExercise = {
                    name: "",
                    notes: "",
                };
                addAlert("Exercise created successfully!", "success");
            })
            .catch((err) => addAlert(err, "error"));
    }
</script>

<section class="bg-black-bean p-4 rounded shadow">
    <h2 class="text-xl text-thistle font-semibold mb-2">Create New Exercise</h2>
    <div class="grid grid-cols-2 gap-2">
        <input
            class="border p-2 rounded bg-seal-brown"
            bind:value={newExercise.name}
            placeholder="Name"
        />
        <input
            class="border p-2 rounded bg-seal-brown"
            bind:value={newExercise.notes}
            placeholder="Category"
        />
    </div>
    <button
        class="mt-3 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        on:click={createExercise}
    >
        ➕ Create
    </button>
</section>
