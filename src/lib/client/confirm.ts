import type { Action } from 'svelte/action';
import { writable } from 'svelte/store';

export interface ConfirmRequest {
    message: string;
    confirm: () => void;
    cancel?: () => void;
}

export const confirmStore = writable<ConfirmRequest | null>(null);

export function askConfirmation(req: ConfirmRequest) {
    confirmStore.set(req);
}


/**
 * Usage:
 * <button
 *   use:confirmable={{ message: 'Delete?', onConfirm: () => form.requestSubmit(btn) }}
 * >
 *   Delete
 * </button>
 */
export const confirmable: Action<
    HTMLButtonElement | HTMLAnchorElement,
    { message: string; onConfirm: () => void; onCancel?: () => void }
> = (node, params) => {
    function handler(e: Event) {
        e.preventDefault();            // stop normal submit/navigation
        askConfirmation({
            message: params.message,
            confirm: params.onConfirm,
            cancel: params.onCancel
        });
    }

    node.addEventListener('click', handler);

    return {
        update(newParams) {
            params = newParams;
        },
        destroy() {
            node.removeEventListener('click', handler);
        }
    };
};
