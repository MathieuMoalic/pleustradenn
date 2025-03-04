import { addAlert } from "$lib/alert";
import { getApi } from "$lib/auth";
import { activePageState } from "$lib/page";
import { writable, get } from "svelte/store";
import type { SessionExerciseRead } from "./api";


export const sessionExerciseList = writable<SessionExerciseRead[]>([]);

export function fetchSessionExercises() {
    let aps = get(activePageState)
    if (aps.page !== "sessionExercise") return;
    getApi()
        .sessionReadDetailed(aps.data.sessionID)
        .then((res) => {
            if (!res.data.session_exercises) {
                return;
            }
            sessionExerciseList.set(res.data.session_exercises);
        })
        .catch((res) => {
            addAlert(
                `Failed to fetch the sessionExercises: ${res.error.detail}`,
                "error",
            );
        });
}

export function editSessionExercise(sessionExercise: SessionExerciseRead) {
    activePageState.update((_) => ({
        page: "sessionExercise",
        data: { sessionID: 1 },
        modal: { open: true, mode: "edit", data: sessionExercise },
    }));
}

export function newSessionExercise() {
    activePageState.update((_) => ({
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
        }
    }));
}

export function submitSessionExercise() {
    activePageState.update((aps) => {
        if (aps.page !== "sessionExercise") return aps;

        if (aps.modal.mode === "edit") {
            getApi()
                .sessionExerciseUpdate(aps.modal.data.id, aps.modal.data)
                .then((_) => resetSessionExercise())
                .catch((res) => {
                    addAlert(
                        `Failed to update the sessionExercise: ${res.error.detail}`,
                        "error",
                    );
                });
            return aps;
        }

        if (aps.modal.mode === "add") {
            getApi()
                .sessionExerciseCreate(aps.modal.data)
                .then((_) => resetSessionExercise())
                .catch((res) => {
                    addAlert(
                        `Failed to create the sessionExercise: ${res.error.detail}`,
                        "error",
                    );
                });
            return aps;
        }

        return aps;
    });
}

export function removeSessionExercise() {
    activePageState.update((aps) => {
        if (aps.page !== "sessionExercise") return aps;

        getApi()
            .sessionExerciseDelete(aps.modal.data.id)
            .then((_) => resetSessionExercise())
            .catch((res) => {
                addAlert(
                    `Failed to delete the sessionExercise: ${res.error.detail}`,
                    "error",
                );
            });

        return aps;
    });
}

function resetSessionExercise() {
    activePageState.update((_) => ({
        page: "sessionExercise",
        data: { sessionID: -1 },
        modal: {
            open: false, mode: "add", data: {
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
        }
    }));
}