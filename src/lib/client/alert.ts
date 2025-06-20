import { writable } from 'svelte/store';


type Alert = {
    id: number;
    message: string;
    type: "success" | "error";
};

// Writable store for alerts
export let alerts = writable<Alert[]>([
]);

// Add a new alert to the store
export function addAlert(message: string, type: "success" | "error") {
    const id = Date.now(); // Unique ID based on timestamp
    let color: "bg-green-400" | "bg-red-400";
    if (type === "success") {
        color = "bg-green-400";
    } else {
        color = "bg-red-400";
        console.error(message);
    }
    alerts.update((currentAlerts) => [
        ...currentAlerts,
        { id, message, type },
    ]);

    // Remove the alert after 2 seconds
    setTimeout(() => {
        removeAlert(id);
    }, 2000);
}

// Remove an alert by ID
export function removeAlert(id: number) {
    alerts.update((currentAlerts) =>
        currentAlerts.filter((alert) => alert.id !== id)
    );
}