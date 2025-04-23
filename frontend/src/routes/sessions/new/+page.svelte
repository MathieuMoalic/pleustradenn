<script lang="ts">
    import SessionForm from "$components/SessionForm.svelte";
    import type { CreateSessionFormData } from "$lib/types";

    // Default values for a new session form.
    const session: CreateSessionFormData = {
        date: new Date(),
        notes: "",
        user_id: 0,
    };
</script>

<SessionForm {session} />
