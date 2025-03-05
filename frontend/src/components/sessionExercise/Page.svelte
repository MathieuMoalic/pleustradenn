<script lang="ts">
    import Modal from "./Modal.svelte";
    import List from "./List.svelte";
    import AddNewButton from "$components/Modal/AddNewButton.svelte";
    import { openSessionExerciseModal } from "$lib/session-exercise";
</script>

<Modal />
<AddNewButton name="Exercise" onclick={openSessionExerciseModal} />
<List />
