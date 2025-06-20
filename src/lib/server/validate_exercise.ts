import { fail, type ActionFailure } from "@sveltejs/kit";

type ExerciseFormData = {
    name: string;
    name_pl: string;
    name_fr: string;
    notes: string;
    intensity_unit: string;
    category: string;
};
export async function validateExerciseFormData(form: FormData): Promise<ExerciseFormData | ActionFailure<{ error: string, form?: any }>> {
    const name = form.get("name")?.toString() ?? "";
    const name_pl = form.get("name_pl")?.toString() ?? "";
    const name_fr = form.get("name_fr")?.toString() ?? "";
    const notes = form.get("notes")?.toString() ?? "";
    const intensity_unit = form.get("intensity_unit")?.toString() ?? "";
    const category = form.get("category")?.toString() ?? "other";

    if (name.trim() === "" && name_pl.trim() === "" && name_fr.trim() === "") {
        return fail(400, { error: "At least one name must be provided.", form: Object.fromEntries(form) });
    }
    return {
        name: name.trim(),
        name_pl: name_pl.trim(),
        name_fr: name_fr.trim(),
        notes: notes.trim(),
        intensity_unit: intensity_unit.trim(),
        category: category.trim(),
    };
}