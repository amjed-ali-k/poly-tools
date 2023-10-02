-- CreateEnum
CREATE TYPE "RoleTypes" AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'CREATOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('BANNED', 'ACTIVE');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('DISCONTINUED', 'PASSOUT', 'ACTIVE');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('REGULAR', 'SUPPLEMENTARY');

-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('THEORY', 'PRACTICAL', 'DRAWING');

-- CreateEnum
CREATE TYPE "EvaluationMode" AS ENUM ('INTERNAL', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('ACTIVE', 'PASSEDOUT');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "role" "RoleTypes" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLink" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" VARCHAR(256) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "phone" TEXT,
    "image" TEXT,
    "bio" VARCHAR(256) NOT NULL DEFAULT '',
    "designation" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "collegeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "registerNo" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "admissionNo" TEXT,
    "collegeId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "rollNo" INTEGER,
    "image" TEXT,
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "cgpa" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "credits" INTEGER,
    "revision" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "totalMarks" INTEGER,
    "type" "SubjectType" NOT NULL,
    "evaluationMode" "EvaluationMode" NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "ExamResultFormatHistory" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdById" TEXT NOT NULL,
    "semesters" JSONB NOT NULL,
    "regularResultCount" INTEGER NOT NULL,
    "supplementaryResultCount" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamResultFormatHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamResult" (
    "id" SERIAL NOT NULL,
    "studentRegNo" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "type" "ExamType" NOT NULL DEFAULT 'REGULAR',
    "semester" INTEGER NOT NULL,
    "sgpa" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mark" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "grade" TEXT,
    "internal" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'ACTIVE',
    "passoutYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'ACTIVE',
    "semester" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Period" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "isPresent" BOOLEAN NOT NULL DEFAULT true,
    "lateTime" INTEGER,
    "isLate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "slug" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserToUserLink" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BranchToCollege" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BranchToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BranchToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BatchToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_key" ON "Role"("role");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_collegeId_idx" ON "User"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_registerNo_key" ON "Student"("registerNo");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_phone_key" ON "Student"("phone");

-- CreateIndex
CREATE INDEX "Student_collegeId_idx" ON "Student"("collegeId");

-- CreateIndex
CREATE INDEX "Student_branchId_idx" ON "Student"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "College_name_key" ON "College"("name");

-- CreateIndex
CREATE UNIQUE INDEX "College_code_key" ON "College"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_name_key" ON "Branch"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_code_key" ON "Branch"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- CreateIndex
CREATE INDEX "ExamResultFormatHistory_createdById_idx" ON "ExamResultFormatHistory"("createdById");

-- CreateIndex
CREATE INDEX "ExamResult_studentRegNo_idx" ON "ExamResult"("studentRegNo");

-- CreateIndex
CREATE INDEX "ExamResult_createdById_idx" ON "ExamResult"("createdById");

-- CreateIndex
CREATE INDEX "Mark_examId_idx" ON "Mark"("examId");

-- CreateIndex
CREATE INDEX "Mark_subjectCode_idx" ON "Mark"("subjectCode");

-- CreateIndex
CREATE INDEX "Batch_collegeId_idx" ON "Batch"("collegeId");

-- CreateIndex
CREATE INDEX "Batch_branchId_idx" ON "Batch"("branchId");

-- CreateIndex
CREATE INDEX "Batch_createdById_idx" ON "Batch"("createdById");

-- CreateIndex
CREATE INDEX "Course_collegeId_idx" ON "Course"("collegeId");

-- CreateIndex
CREATE INDEX "Course_branchId_idx" ON "Course"("branchId");

-- CreateIndex
CREATE INDEX "Course_subjectCode_idx" ON "Course"("subjectCode");

-- CreateIndex
CREATE INDEX "Course_batchId_idx" ON "Course"("batchId");

-- CreateIndex
CREATE INDEX "Period_courseId_idx" ON "Period"("courseId");

-- CreateIndex
CREATE INDEX "Attendance_studentId_idx" ON "Attendance"("studentId");

-- CreateIndex
CREATE INDEX "Attendance_periodId_idx" ON "Attendance"("periodId");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_slug_key" ON "Tool"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToUserLink_AB_unique" ON "_UserToUserLink"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToUserLink_B_index" ON "_UserToUserLink"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BranchToCollege_AB_unique" ON "_BranchToCollege"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchToCollege_B_index" ON "_BranchToCollege"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BranchToUser_AB_unique" ON "_BranchToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchToUser_B_index" ON "_BranchToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BranchToSubject_AB_unique" ON "_BranchToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchToSubject_B_index" ON "_BranchToSubject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BatchToStudent_AB_unique" ON "_BatchToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_BatchToStudent_B_index" ON "_BatchToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToUser_AB_unique" ON "_CourseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToUser_B_index" ON "_CourseToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToStudent_AB_unique" ON "_CourseToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToStudent_B_index" ON "_CourseToStudent"("B");
