<script lang="ts">
	import ActiveItems from "$components/ActiveItems.svelte";
	import InactiveItems from "$components/InactiveItems.svelte";
	import Search from "$components/Search.svelte";
	import SearchResult from "$components/SearchResult.svelte";
	import ItemForm from "$components/ItemForm.svelte";
	import { items, searching, categories } from "$lib/store";
	import { apiInner, api } from "$lib/auth";
	import { onMount } from "svelte";
	import AddItemButton from "$components/AddItemButton.svelte";
	import Alert from "$components/Alert.svelte";
	import { addAlert } from "$lib/alert";
	import { goto } from "$app/navigation";

	async function fetchData() {
		api.itemReadAll()
			.then((res) => {
				items.set(res.data);
			})
			.catch((res) => {
				addAlert("Failed to fetch items: " + res.error, "error");
			});
		api.categoryreadAll()
			.then((res) => {
				categories.set(res.data);
			})
			.catch((res) => {
				addAlert("Failed to fetch categories: " + res.error, "error");
			});
	}
	onMount(async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			goto("/login");
		} else {
			apiInner.setSecurityData({ accessToken: token });
		}
		await fetchData();
	});
</script>

<Search />
{#if $searching}
	<SearchResult />
{:else}
	<ActiveItems />
	<hr class="m-4" />
	<InactiveItems />
{/if}
<ItemForm />
<AddItemButton />
<Alert />
