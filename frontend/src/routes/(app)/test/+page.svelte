<script lang="ts">
    import { page } from "$app/stores";
</script>

<nav>
    <a href="/">Home</a>
    {#if $page.data.user}
        <span>Welcome, {$page.data.user.username}!</span>
        <form method="POST" action="/logout" style="display: inline;">
            <button type="submit">Logout</button>
        </form>
    {:else}
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    {/if}
</nav>
protected route

<hr />
