-- CreateTable
CREATE TABLE "Elevator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locationName" TEXT NOT NULL,
    "locationCity" TEXT NOT NULL,
    "locationCountry" TEXT NOT NULL,
    "locationType" TEXT NOT NULL,
    "speedTotalSeconds" REAL NOT NULL,
    "speedFloors" INTEGER NOT NULL,
    "speedSecondsPerFloor" REAL NOT NULL,
    "ratingSpeed" REAL NOT NULL,
    "ratingSmoothness" REAL NOT NULL,
    "ratingDesign" REAL NOT NULL,
    "ratingCapacity" REAL NOT NULL,
    "overallScore" REAL NOT NULL,
    "notes" TEXT,
    "dateVisited" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
