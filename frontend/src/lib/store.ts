import { writable, derived } from "svelte/store";
import Fuse from "fuse.js";
import type { modalState } from "$lib/types";
import { type CategoryRead, type ItemRead } from "$lib/Api";

export const items = writable<ItemRead[]>([]);
export const categories = writable<CategoryRead[]>([]);
export const searchTerm = writable<string>("");

export const searching = derived(searchTerm, ($searchTerm) => $searchTerm.length > 0);

export const fuse = derived(items, ($items) => {
    return new Fuse($items, {
        keys: ["name"],
        threshold: 0.8,
    });
});

export const searchResults = derived(
    [fuse, searchTerm],
    ([$fuse, $searchTerm]) => {
        if (!$searchTerm) return [];
        return $fuse.search($searchTerm).map((result) => result.item);
    }
);

export const itemForm = writable<modalState>({
    isOpen: false, item: {
        name: "",
        category_id: 0,
        quantity: null,
    }, mode: "add",
    itemID: -1,
});

export const categoryFormOpen = writable<boolean>(false);
