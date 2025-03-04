import { addAlert } from "$lib/alert";
import { getApi } from "$lib/auth";
import { activePageState } from "$lib/page";
import { writable } from "svelte/store";
import { type ExerciseRead } from "./api";

export const exerciseList = writable<ExerciseRead[]>([]);

export function fetchExercises() {
    getApi()
        .exerciseReadAll()
        .then((res) => {
            exerciseList.set(res.data);
        })
        .catch((res) => {
            addAlert(`Failed to fetch the exercises: ${res.error.detail}`, "error");
        }
        );
}

export function editExercise(exercise: ExerciseRead) {
    activePageState.update((_) => ({
        page: "exercise",
        data: { sessionID: 1 },
        modal: { open: true, mode: "edit", data: exercise },
    }));
}

export function newExercise() {
    activePageState.set({
        page: "exercise",
        data: {},
        modal: {
            open: true, mode: "add", data: {
                name: "",
                notes: "",
                id: -1
            }
        }
    });
}

export function submitExercise() {
    activePageState.update((aps) => {
        if (aps.page !== "exercise") return aps;

        if (aps.modal.mode === "edit") {
            getApi()
                .exerciseUpdate(aps.modal.data.id, aps.modal.data)
                .then((_) => resetExercise())
                .catch((res) => {
                    addAlert(
                        `Failed to update the exercise: ${res.error.detail}`,
                        "error",
                    );
                });
            return aps;
        }

        if (aps.modal.mode === "add") {
            getApi()
                .exerciseCreate(aps.modal.data)
                .then((_) => resetExercise())
                .catch((res) => {
                    addAlert(
                        `Failed to create the exercise: ${res.error.detail}`,
                        "error",
                    );
                });
            return aps;
        }

        return aps;
    });
}

export function removeExercise() {
    activePageState.update((aps) => {
        if (aps.page !== "exercise") return aps;

        getApi()
            .exerciseDelete(aps.modal.data.id)
            .then((_) => resetExercise())
            .catch((res) => {
                addAlert(
                    `Failed to delete the exercise: ${res.error.detail}`,
                    "error",
                );
            });

        return aps;
    });
}

function resetExercise() {
    activePageState.set({
        page: "exercise",
        data: {},
        modal: {
            open: false, mode: "add", data: {
                name: "",
                notes: "",
                id: -1
            }
        }
    });
}