/*
  Warnings:

  - You are about to drop the column `recommended_reps_max` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `recommended_reps_min` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `recommended_rest_seconds` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `recommended_sets` on the `Exercise` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "category_id" INTEGER NOT NULL,
    CONSTRAINT "Exercise_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "ExerciseCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Exercise" ("category_id", "id", "name", "notes") SELECT "category_id", "id", "name", "notes" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
