<script lang="ts">
    import Modal from "./Modal.svelte";
    import List from "./List.svelte";
    import AddNewButton from "$components/Modal/AddNewButton.svelte";
    import { openExerciseModal } from "$lib/exercise";
</script>

<Modal />
<AddNewButton name="Exercise" onclick={openExerciseModal} />
<List />
