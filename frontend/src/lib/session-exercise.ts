import { addAlert } from "$lib/alert";
import { getApi } from "$lib/auth";
import { activePageState, closeModal } from "$lib/page";
import { writable, get } from "svelte/store";
import type { ExerciseRead, SessionExerciseRead } from "./api";
import { exerciseList } from "./exercise";


export const sessionExerciseList = writable<SessionExerciseRead[]>([]);


export function create() {
    activePageState.update((aps) => {
        if (aps.page !== "sessionExercise") return aps;
        aps.modal.data.created_at = formatDate(new Date());
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
    let aps = get(activePageState);
    if (aps.page !== "sessionExercise") return;
    // new sessionExercise
    if (se === null) {
        activePageState.set({
            page: "sessionExercise",
            data: { sessionID: aps.data.sessionID, exercise: null },
            modal: {
                open: true, mode: "add", data: {
                    sets: 0,
                    reps: 0,
                    weight: 0,
                    session_id: aps.data.sessionID,
                    exercise_id: -1,
                    rest_seconds: 0,
                    count: 0,
                    exercise_name: "",
                    id: -1,
                    completed: false,
                    created_at: "",
                }
            },
        });
    } else {
        let ex = get(exerciseList).find((e) => e.id === se.exercise_id)
        let exercise: ExerciseRead | null = null;
        if (ex === undefined) {
            exercise = null;
        } else {
            exercise = ex;
        }
        activePageState.set({
            page: "sessionExercise",
            data: { sessionID: se.session_id, exercise: exercise },
            modal: { open: true, mode: "edit", data: se },
        });
    }

}

export function incrementSet(ex: SessionExerciseRead): SessionExerciseRead {
    let new_ex = { ...ex, count: ex.count + 1 };
    if (new_ex.sets === new_ex.count) {
        new_ex.completed = true;
    }
    getApi()
        .sessionExerciseUpdate(ex.id, new_ex)
        .then((res) => {
            sessionExerciseList.update((ses) => {
                const idx = ses.findIndex((s) => s.id === res.data.id);
                if (idx === -1) return ses;
                ses[idx] = res.data;
                return ses;
            });
        })
        .catch((res) => {
            addAlert(
                `Failed to update the sessionExercise: ${res.error.detail}`,
                "error",
            );
        });
    return new_ex;
}

export function loadMostRecentExerciseData(ex: ExerciseRead) {
    getApi()
        .sessionExerciseReadLatestByExercise(ex.id)
        .then((res) => {
            if (res.data !== null) {
                activePageState.update((aps) => {
                    if (aps.page !== "sessionExercise" || res.data === null) return aps;
                    aps.modal.data.sets = res.data.sets;
                    aps.modal.data.reps = res.data.reps;
                    aps.modal.data.weight = res.data.weight;
                    aps.modal.data.rest_seconds = res.data.rest_seconds;
                    aps.modal.data.count = res.data.count;
                    return aps;
                }
                );
            } else {
                activePageState.update((aps) => {
                    if (aps.page !== "sessionExercise") return aps;
                    aps.modal.data.sets = ex.recommended_sets;
                    aps.modal.data.reps = ex.recommended_reps_min;
                    aps.modal.data.weight = 0;
                    aps.modal.data.rest_seconds = ex.recommended_rest_seconds;
                    aps.modal.data.count = 0;
                    return aps;
                }
                );
            }
        })
        .catch((res) => {
            addAlert(
                `Failed to fetch the sessionExercise: ${res.error.detail}`,
                "error",
            );
        }
        );

}

function formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}