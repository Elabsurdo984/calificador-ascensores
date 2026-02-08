/*
  Warnings:

  - You are about to drop the column `ratingCapacity` on the `Elevator` table. All the data in the column will be lost.
  - Added the required column `ratingAccessibility` to the `Elevator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingCleanliness` to the `Elevator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingLighting` to the `Elevator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingMaintenance` to the `Elevator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingNoise` to the `Elevator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingPrecision` to the `Elevator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingSafety` to the `Elevator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingSpaciousness` to the `Elevator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingTechnology` to the `Elevator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingVentilation` to the `Elevator` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Elevator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locationName" TEXT NOT NULL,
    "locationCity" TEXT,
    "locationCountry" TEXT,
    "locationType" TEXT NOT NULL,
    "locationAddress" TEXT,
    "locationLat" REAL,
    "locationLng" REAL,
    "techBrand" TEXT,
    "techModel" TEXT,
    "techYear" INTEGER,
    "techMaxLoad" REAL,
    "techMaxPersons" INTEGER,
    "techFloors" INTEGER,
    "speedTotalSeconds" REAL NOT NULL,
    "speedFloors" INTEGER NOT NULL,
    "speedSecondsPerFloor" REAL NOT NULL,
    "ratingSpeed" REAL NOT NULL,
    "ratingSmoothness" REAL NOT NULL,
    "ratingPrecision" REAL NOT NULL,
    "ratingNoise" REAL NOT NULL,
    "ratingLighting" REAL NOT NULL,
    "ratingVentilation" REAL NOT NULL,
    "ratingSpaciousness" REAL NOT NULL,
    "ratingCleanliness" REAL NOT NULL,
    "ratingMaintenance" REAL NOT NULL,
    "ratingDesign" REAL NOT NULL,
    "ratingTechnology" REAL NOT NULL,
    "ratingSafety" REAL NOT NULL,
    "ratingAccessibility" REAL NOT NULL,
    "overallScore" REAL NOT NULL,
    "notes" TEXT,
    "dateVisited" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Elevator" ("createdAt", "dateVisited", "id", "locationCity", "locationCountry", "locationName", "locationType", "notes", "overallScore", "ratingDesign", "ratingSmoothness", "ratingSpeed", "speedFloors", "speedSecondsPerFloor", "speedTotalSeconds", "updatedAt") SELECT "createdAt", "dateVisited", "id", "locationCity", "locationCountry", "locationName", "locationType", "notes", "overallScore", "ratingDesign", "ratingSmoothness", "ratingSpeed", "speedFloors", "speedSecondsPerFloor", "speedTotalSeconds", "updatedAt" FROM "Elevator";
DROP TABLE "Elevator";
ALTER TABLE "new_Elevator" RENAME TO "Elevator";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
