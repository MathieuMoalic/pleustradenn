-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SessionExercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_id" INTEGER NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL DEFAULT 1,
    "reps" INTEGER NOT NULL DEFAULT 1,
    "weight" REAL NOT NULL DEFAULT 0.0,
    "rest_seconds" INTEGER NOT NULL DEFAULT 60,
    "count" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "SessionExercise_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SessionExercise_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SessionExercise" ("completed", "count", "created_at", "exercise_id", "id", "notes", "reps", "rest_seconds", "session_id", "sets", "success", "weight") SELECT "completed", "count", "created_at", "exercise_id", "id", "notes", "reps", "rest_seconds", "session_id", "sets", "success", "weight" FROM "SessionExercise";
DROP TABLE "SessionExercise";
ALTER TABLE "new_SessionExercise" RENAME TO "SessionExercise";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
