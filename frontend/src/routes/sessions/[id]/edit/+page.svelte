<script lang="ts">
    import SessionForm from "$components/SessionForm.svelte";
    export let data;
</script>

<SessionForm session={data.session} />
