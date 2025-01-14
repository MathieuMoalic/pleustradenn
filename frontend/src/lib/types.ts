import type { ItemUpdate, ItemCreate } from "$lib/Api";

export let possibleUnits = ["None", "kg", "g", "l", "ml", "pcs", "cans", "bottles"];

export interface modalState {
    isOpen: boolean;
    item: ItemUpdate | ItemCreate;
    itemID: number;
    mode: "edit" | "add";
} 