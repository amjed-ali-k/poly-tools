/*
  Warnings:

  - You are about to drop the `ExamResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mark` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ExamResult";

-- DropTable
DROP TABLE "Mark";

-- CreateTable
CREATE TABLE "StudentBatchForExam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "students" JSONB NOT NULL,
    "studentsCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "StudentBatchForExam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentBatchForExam_createdById_idx" ON "StudentBatchForExam"("createdById");
