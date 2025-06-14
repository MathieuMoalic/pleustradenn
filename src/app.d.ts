declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: { id: string; username: string; language: 'en' | 'fr' | 'pl' } | null; // Type for logged-in user
			sessionId: string | null; // Type for session ID

		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };