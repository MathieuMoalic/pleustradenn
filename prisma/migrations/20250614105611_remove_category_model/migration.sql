/*
  Warnings:

  - You are about to drop the `ExerciseCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `category_id` on the `Exercise` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ExerciseCategory_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ExerciseCategory";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL DEFAULT 'other',
    "intensity_unit" TEXT NOT NULL DEFAULT 'kg',
    "name" TEXT NOT NULL,
    "name_fr" TEXT,
    "name_pl" TEXT,
    "notes" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Exercise" ("id", "intensity_unit", "name", "name_fr", "name_pl", "notes") SELECT "id", "intensity_unit", "name", "name_fr", "name_pl", "notes" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
