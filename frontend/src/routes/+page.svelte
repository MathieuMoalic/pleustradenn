<script lang="ts">
	import "../app.css";

	import ExercisePage from "$components/exercise/Page.svelte";
	import SessionPage from "$components/session/Page.svelte";
	import SessionExercisePage from "$components/sessionExercise/Page.svelte";
	import LoginPage from "$components/Login/Page.svelte";
	import Navbar from "../components/Navbar.svelte";
	import Alert from "$components/Alert.svelte";

	import { activePageState } from "$lib/page";
</script>

<Alert />
{#if $activePageState.page === "login"}
	<LoginPage />
{:else}
	<main class="min-h-screen bg-seal-brown pt-3">
		<Navbar />
		<section class="font-['Segoe_UI',sans-serif] p-4">
			{#if $activePageState.page === "exercise"}
				<ExercisePage />
			{:else if $activePageState.page === "session"}
				<SessionPage />
			{:else if $activePageState.page === "sessionExercise"}
				<SessionExercisePage />
			{:else}
				<p>404</p>
			{/if}
		</section>
	</main>
{/if}
