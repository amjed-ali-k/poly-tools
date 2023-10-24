/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToUserLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "UserLink";

-- DropTable
DROP TABLE "_UserToUserLink";

-- CreateTable
CREATE TABLE "ExamHall" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commonSeats" INTEGER NOT NULL,
    "theoryOnlySeats" INTEGER NOT NULL,
    "drawingOnlySeats" INTEGER NOT NULL,
    "structure" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "ExamHall_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExamHall_createdById_idx" ON "ExamHall"("createdById");
