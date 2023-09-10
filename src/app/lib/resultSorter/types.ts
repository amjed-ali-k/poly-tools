enum Grade {
  F = "F",
  E = "E",
  D = "D",
  C = "C",
  B = "B",
  A = "A",
  S = "S",
}

export type AllGrades = Grade | "Absent" | "Withheld" | "Malpractice";

export interface ResultType {
  registerNo: number;
  studentName: string;
  branch: string;
  semester: number;
  course: string;
  examType: "Regular" | "Supplementary";
  attendance: "Present" | "Absent";
  withheld:
    | "Withheld"
    | "With held for Malpractice"
    | '"With held for Malpractice"'
    | null;
  iMark: number | null;
  grade: Grade | null;
  result: "P" | "F" | null;
}

export type courseCode = string;
export interface FormattedType {
  registerNo: number;
  studentName: string;
  branch: string;
  semester: number;
  examType: "Regular" | "Supplementary";
  grades: {
    [key: courseCode]: {
      name: string;
      internal: number;
      grade: AllGrades | null;
    };
  };
  cgpa?: string;
  // withheld: "Withheld" | "With held for Malpractice" | null;
}

export interface OptionsType {
  isImark: boolean;
  isCgpa: boolean;
  phone?: string;
  sortType: "registerNo" | "studentName" | "cgpa";
}
