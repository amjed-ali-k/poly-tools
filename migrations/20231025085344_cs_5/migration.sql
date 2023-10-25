-- CreateTable
CREATE TABLE "ExamsForSeatingArrangement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "ExamsForSeatingArrangement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExamHallToExamsForSeatingArrangement" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExamsForSeatingArrangementToStudentBatchForExam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "ExamsForSeatingArrangement_createdById_idx" ON "ExamsForSeatingArrangement"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "_ExamHallToExamsForSeatingArrangement_AB_unique" ON "_ExamHallToExamsForSeatingArrangement"("A", "B");

-- CreateIndex
CREATE INDEX "_ExamHallToExamsForSeatingArrangement_B_index" ON "_ExamHallToExamsForSeatingArrangement"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExamsForSeatingArrangementToStudentBatchForExam_AB_unique" ON "_ExamsForSeatingArrangementToStudentBatchForExam"("A", "B");

-- CreateIndex
CREATE INDEX "_ExamsForSeatingArrangementToStudentBatchForExam_B_index" ON "_ExamsForSeatingArrangementToStudentBatchForExam"("B");
