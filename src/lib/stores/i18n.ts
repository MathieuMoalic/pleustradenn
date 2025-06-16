import type { Exercise } from '@prisma/client';
import { get, writable, derived } from 'svelte/store';

export function exerciseNamei18n(exercise: Exercise): string {
    const lang = get(language);
    if (lang === 'pl' && exercise.name_pl?.trim()) {
        return exercise.name_pl;
    } else if (lang === 'fr' && exercise.name_fr?.trim()) {
        return exercise.name_fr;
    }
    return exercise.name;
}


const dict = {
    session: { en: 'Session', pl: 'Trening', fr: 'Séance' },
    exercise: { en: 'Exercise', pl: 'Ćwiczenie', fr: 'Exercice' },
    sets: { en: 'Sets', pl: 'Serie', fr: 'Séries' },
    reps: { en: 'Reps', pl: 'Powtórzenia', fr: 'Répétitions' },
    unit: { en: 'Unit', pl: 'Jednostka', fr: 'Unité' },
    notes: { en: 'Notes', pl: 'Notatki', fr: 'Notes' },
    save: { en: 'Save', pl: 'Zapisz', fr: 'Enregistrer' },
    delete: { en: 'Delete', pl: 'Usuń', fr: 'Supprimer' },
    logout: { en: 'Logout', pl: 'Wyloguj', fr: 'Déconnexion' },
    yes: { en: 'Yes', pl: 'Tak', fr: 'Oui' },
    no: { en: 'No', pl: 'Nie', fr: 'Non' },
    session_date: { en: 'Session Date', pl: 'Data Treningu', fr: 'Date de la séance' },
    add: { en: 'Add', pl: 'Dodaj', fr: 'Ajouter' },
    intensity: { en: 'Intensity', pl: 'Intensywność', fr: 'Intensité' },
    exercises: { en: 'Exercises', pl: 'Ćwiczenia', fr: 'Exercices' },
    sessions: { en: 'Sessions', pl: 'Treningi', fr: 'Séances' },
    back_to_categories: { en: 'Back to Categories', pl: 'Powrót do kategorii', fr: 'Retour aux catégories' },
    no_exercises: { en: 'No exercises found', pl: 'Brak ćwiczeń', fr: 'Aucun exercice trouvé' },
    no_sets: { en: 'No sets recorded for this session yet.', pl: 'Brak zapisanych serii dla tego treningu.', fr: 'Aucun set enregistré pour cette séance.' },
    log: {
        en: 'Log',
        pl: 'Dziennik',
        fr: 'Journal'
    },
};

const categories = {
    push: {
        en: 'Push',
        pl: 'Wyciskanie',
        fr: 'Poussée'
    },
    pull: {
        en: 'Pull',
        pl: 'Przyciąganie',
        fr: 'Tirage'
    },
    legs: {
        en: 'Legs',
        pl: 'Nogi',
        fr: 'Jambes'
    },
    core: {
        en: 'Core',
        pl: 'Tułów',
        fr: 'Tronc'
    },
    forearms: {
        en: 'Forearms',
        pl: 'Przedramiona',
        fr: 'Avant-bras'
    },
    other: {
        en: 'Other',
        pl: 'Inne',
        fr: 'Autre'
    },
};

export const language = writable<'en' | 'pl' | 'fr'>('en');

export const t = derived(language, ($lang) => (key: keyof typeof dict) =>
    dict[key][$lang] ?? dict[key].en
);

export const c = derived(language, ($lang) => (key: keyof typeof categories) =>
    categories[key][$lang] ?? categories[key].en
);
export const cs = derived(language, ($lang) => {
    return Object.fromEntries(
        Object.entries(categories).map(([key, value]) => [key, value[$lang] ?? value.en])
    );
}
);