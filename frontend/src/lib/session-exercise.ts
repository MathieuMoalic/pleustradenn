import { addAlert } from "$lib/alert";
import { getApi } from "$lib/auth";
import { activePageState, closeModal } from "$lib/page";
import { writable, get } from "svelte/store";
import type { SessionExerciseRead } from "./api";


export const sessionExerciseList = writable<SessionExerciseRead[]>([]);


export function create() {
    activePageState.update((aps) => {
        if (aps.page !== "sessionExercise") return aps;
        getApi()
            .sessionExerciseCreate(aps.modal.data)
            .then((res) => {
                sessionExerciseList.update((ses) => {
                    ses.unshift(res.data);
                    return ses;
                });
                closeModal();
            }
            )
            .catch((res) => {
                addAlert(
                    `Failed to create the sessionExercise: ${res.error.detail}`,
                    "error",
                );
            });
        return aps;
    }
    );
}

export function read() {
    let aps = get(activePageState);
    if (aps.page !== "sessionExercise") return;
    if (aps.data.sessionID === -1) return;
    getApi()
        .sessionReadDetailed(aps.data.sessionID)
        .then((res) => {
            if (!res.data.session_exercises) {
                return;
            }
            sessionExerciseList.set(res.data.session_exercises);
        })
        .catch((res) => {
            addAlert(`Failed to fetch the sessions: ${res.error.detail}`, "error");
        }
        );
}

export function update() {
    activePageState.update((aps) => {
        if (aps.page !== "sessionExercise") return aps;
        getApi()
            .sessionExerciseUpdate(aps.modal.data.id, aps.modal.data)
            .then((res) => {
                sessionExerciseList.update((ses) => {
                    const idx = ses.findIndex((s) => s.id === res.data.id);
                    if (idx === -1) return ses;
                    ses[idx] = res.data;
                    return ses;
                });
                closeModal();
            })
            .catch((res) => {
                addAlert(
                    `Failed to update the sessionExercise: ${res.error.detail}`,
                    "error",
                );
            });
        return aps;
    });
}

export function remove() {
    activePageState.update((aps) => {
        if (aps.page !== "sessionExercise") return aps;
        getApi()
            .sessionDelete(aps.modal.data.id)
            .then((res) => {
                sessionExerciseList.update((ses) => {
                    const idx = ses.findIndex((s) => s.id === res.data.id);
                    if (idx === -1) return ses;
                    ses.splice(idx, 1);
                    return ses;
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

export function openSessionExerciseModal(se: SessionExerciseRead | null) {
    if (se === null) {
        activePageState.set({
            page: "sessionExercise",
            data: { sessionID: -1 },
            modal: {
                open: true, mode: "add", data: {
                    sets: 0,
                    reps: 0,
                    weight: 0,
                    session_id: -1,
                    exercise_id: -1,
                    rest_seconds: 0,
                    count: 0,
                    exercise_name: "",
                    id: -1
                }
            },
        });
    } else {
        activePageState.set({
            page: "sessionExercise",
            data: { sessionID: se.session_id },
            modal: { open: true, mode: "edit", data: se },
        });
    }

}
