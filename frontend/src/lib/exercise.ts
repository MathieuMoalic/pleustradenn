import { addAlert } from "$lib/alert";
import { getApi } from "$lib/auth";
import { activePageState, closeModal } from "$lib/page";
import { get, writable } from "svelte/store";
import { type ExerciseRead } from "./api";

export const exerciseList = writable<ExerciseRead[]>([]);

export function create() {
    activePageState.update((aps) => {
        if (aps.page !== "exercise") return aps;
        getApi()
            .exerciseCreate(aps.modal.data)
            .then((res) => {
                exerciseList.update((ses) => {
                    ses.unshift(res.data);
                    return ses;
                });
                closeModal();
            }
            )
            .catch((res) => {
                addAlert(
                    `Failed to create the exercise: ${res.error.detail}`,
                    "error",
                );
            });
        return aps;
    }
    );
}

export function read() {
    let aps = get(activePageState)
    if (aps.page !== "exercise") return;
    getApi()
        .exerciseReadAll()
        .then((res) => {
            exerciseList.set(res.data);
        })
        .catch((res) => {
            addAlert(`Failed to fetch the sessions: ${res.error.detail}`, "error");
        }
        );
}

export function update() {
    activePageState.update((aps) => {
        if (aps.page !== "exercise") return aps;
        getApi()
            .exerciseUpdate(aps.modal.data.id, aps.modal.data)
            .then((res) => {
                exerciseList.update((ses) => {
                    const idx = ses.findIndex((s) => s.id === res.data.id);
                    if (idx === -1) return ses;
                    ses[idx] = res.data;
                    return ses;
                });
                closeModal();
            })
            .catch((res) => {
                addAlert(
                    `Failed to update the exercise: ${res.error.detail}`,
                    "error",
                );
            });
        return aps;
    });
}

export function remove() {
    activePageState.update((aps) => {
        if (aps.page !== "exercise") return aps;
        getApi()
            .sessionDelete(aps.modal.data.id)
            .then((res) => {
                exerciseList.update((es) => {
                    const idx = es.findIndex((s) => s.id === res.data.id);
                    if (idx === -1) return es;
                    es.splice(idx, 1);
                    return es;
                }
                );
                closeModal();
            })
            .catch((res) => {
                addAlert(
                    `Failed to delete the session: ${res.error.detail}`,
                    "error",
                );
            });
        return aps;
    });
}

export function openExerciseModal(se: ExerciseRead | null) {
    if (se === null) {
        activePageState.set({
            page: "exercise",
            data: {},
            modal: {
                open: true, mode: "add", data: {
                    id: -1,
                    name: "",
                    notes: "",
                }
            },
        });
    } else {
        activePageState.set({
            page: "exercise",
            data: {},
            modal: { open: true, mode: "edit", data: se },
        });
    }

}
