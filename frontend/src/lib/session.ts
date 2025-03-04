import { addAlert } from "$lib/alert";
import { getApi } from "$lib/auth";
import { activePageState, closeModal } from "$lib/page";
import { writable } from "svelte/store";
import type { SessionReadBasic, SessionReadDetailed } from "./api";


export const sessionList = writable<SessionReadBasic[]>([]);

export function fetchSessions() {
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

export function editSession(session: SessionReadDetailed) {
    activePageState.update((_) => ({
        page: "session",
        data: { selectedDate: new Date() },
        modal: { open: true, mode: "edit", data: session },
    }));
}

export function newSession() {
    activePageState.update((_) => ({
        page: "session",
        data: { selectedDate: new Date() },
        modal: { open: true, mode: "add", data: { date: "", notes: "", id: -1, session_exercises: [] } },
    }));
}

export function submitSession() {
    activePageState.update((aps) => {
        if (aps.page !== "session") return aps;

        if (aps.modal.mode === "edit") {
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
        }

        if (aps.modal.mode === "add") {
            getApi()
                .sessionCreate({
                    date: aps.data.selectedDate.toISOString().split("T")[0],
                    notes: aps.modal.data.notes,
                })
                .then((res) => {
                    sessionList.update((sessions) => {
                        sessions.push(res.data);
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

        return aps;
    });
}

export function removeSession() {
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


export function showSessionExercise(sessionID: number) {
    activePageState.update((_) => ({
        page: "sessionExercise",
        data: { sessionID },
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
        },
    }));
}
