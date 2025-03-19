import { addAlert } from "$lib/alert";
import { getApi } from "$lib/auth";
import { activePageState, closeModal } from "$lib/page";
import { writable } from "svelte/store";
import type { SessionReadBasic, SessionReadDetailed } from "./api";


export const sessionList = writable<SessionReadBasic[]>([]);

export function clone(id: number) {
    getApi()
        .sessionClone(id)
        .then((res) => {
            sessionList.update((sessions) => {
                sessions.unshift(res.data);
                return sessions;
            });
        }
        )
        .catch((res) => {
            addAlert(`Failed to clone the session: ${res.error.detail}`, "error");
        });
}
export function create() {
    activePageState.update((aps) => {
        if (aps.page !== "session") return aps;

        aps.modal.data.date = formatDate(aps.data.selectedDate);

        getApi()
            .sessionCreate(aps.modal.data)
            .then((res) => {
                sessionList.update((sessions) => {
                    sessions.unshift(res.data);
                    return sessions;
                });
                closeModal();
            }
            )
            .catch((res) => {
                addAlert(
                    `Failed to create the session: ${res.error.detail}`,
                    "error",
                );
            });
        return aps;
    }
    );
}

export function read() {
    getApi()
        .sessionReadAll()
        .then((res) => {
            sessionList.set(res.data);
        })
        .catch((res) => {
            addAlert(`Failed to fetch the sessions: ${res.error.detail}`, "error");
        }
        );
}

export function update() {
    activePageState.update((aps) => {
        if (aps.page !== "session") return aps;
        aps.modal.data.date = formatDate(aps.data.selectedDate);
        getApi()
            .sessionUpdate(aps.modal.data.id, aps.modal.data)
            .then((res) => {
                sessionList.update((sessions) => {
                    const idx = sessions.findIndex((s) => s.id === res.data.id);
                    if (idx === -1) return sessions;
                    sessions[idx] = res.data;
                    return sessions;
                });
                closeModal();
            })
            .catch((res) => {
                addAlert(
                    `Failed to update the session: ${res.error.detail}`,
                    "error",
                );
            });
        return aps;
    });
}

export function remove() {
    activePageState.update((aps) => {
        if (aps.page !== "session") return aps;
        getApi()
            .sessionDelete(aps.modal.data.id)
            .then((res) => {
                sessionList.update((sessions) => {
                    const idx = sessions.findIndex((s) => s.id === res.data.id);
                    if (idx === -1) return sessions;
                    sessions.splice(idx, 1);
                    return sessions;
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

export function openSessionModal(session: SessionReadDetailed | null) {
    if (session === null) {
        activePageState.set({
            page: "session",
            data: { selectedDate: new Date() },
            modal: { open: true, mode: "add", data: { date: "", notes: "", id: -1, session_exercises: [] } },
        });
    } else {
        activePageState.set({
            page: "session",
            data: { selectedDate: new Date(session.date) },
            modal: { open: true, mode: "edit", data: session },
        });
    }
}

export function openSessionExercise(sessionID: number) {
    activePageState.set({
        page: "sessionExercise",
        data: { sessionID, exercise: null },
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
                id: -1,
                completed: false,
                created_at: "",
            }
        },
    });
}

function formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}