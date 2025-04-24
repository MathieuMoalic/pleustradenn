<script lang="ts">
    import SessionForm from "$components/SessionForm.svelte";
    import type { CreateSessionFormData } from "$lib/types";

    const session: CreateSessionFormData = {
        date: new Date(),
        notes: "",
    };
</script>

<SessionForm {session} />
