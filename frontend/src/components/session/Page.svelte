<script lang="ts">
    import Modal from "./Modal.svelte";
    import List from "./List.svelte";
    import AddNewButton from "$components/Modal/AddNewButton.svelte";
    import { openSessionModal } from "$lib/session";
</script>

<Modal />
<AddNewButton name="Session" onclick={openSessionModal} />
<List />
