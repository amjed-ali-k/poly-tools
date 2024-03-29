import { prisma } from "@/server/db/prisma";
import collegesList from "./college-list.json";
import branchesList from "./branches-list.json";
import subjectList from "./subjects-list.json";
import { NextRequest, NextResponse } from "next/server";
import { EvaluationMode, SubjectType } from "@prisma/client";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    res: "Good",
  });
}

async function populateColleges() {
  const colleges = collegesList;

  await prisma.college.createMany({ data: colleges });
}

async function populateBranches() {
  const branches = branchesList;

  await prisma.branch.createMany({ data: branches });
}

interface SubjectImportType {
  category: string;
  code: string;
  title: string;
  totalMarks: number | null;
  type: "T" | "D" | "P";
  evalMode: "B" | "I";
  credits: number | null;
  scheme: "REV2021";
  program: string[];
  semester:
    | "First Semester"
    | "Second Semester"
    | "Third Semester"
    | "Fourth Semester"
    | "Fifth Semester"
    | "Sixth Semester";
  key: string;
}

const sems = [
  "First Semester",
  "Second Semester",
  "Third Semester",
  "Fourth Semester",
  "Fifth Semester",
  "Sixth Semester",
];

const subTypes = {
  T: SubjectType.THEORY,
  D: SubjectType.DRAWING,
  P: SubjectType.PRACTICAL,
};

async function populateSubjects() {
  const subjects = subjectList as SubjectImportType[];
  const results: string[] = [];
  const unresolvedPromises = subjects.map(async (e) => {
    await prisma.subject.create({
      data: {
        code: e.code,
        name: e.title,
        credits: e.credits,
        revision: 2021,
        category: e.category,
        semester: sems.findIndex((s) => s === e.semester) + 1,
        type: subTypes[e.type],
        evaluationMode:
          e.evalMode === "B"
            ? EvaluationMode.EXTERNAL
            : EvaluationMode.INTERNAL,
        totalMarks: e.totalMarks,
        branches: {
          connect: e.program.map((p) => ({
            code: p,
          })),
        },
      },
    });
    results.push(e.code);
  });

  await Promise.all(unresolvedPromises);
}
