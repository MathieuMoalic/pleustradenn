/*
  Warnings:

  - Made the column `user_id` on table `Exercise` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'other',
    "intensity_unit" TEXT NOT NULL DEFAULT 'kg',
    "name" TEXT NOT NULL,
    "name_fr" TEXT,
    "name_pl" TEXT,
    "notes" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Exercise_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Exercise" ("category", "id", "intensity_unit", "name", "name_fr", "name_pl", "notes", "user_id") SELECT "category", "id", "intensity_unit", "name", "name_fr", "name_pl", "notes", "user_id" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
