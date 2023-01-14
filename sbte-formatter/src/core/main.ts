//
import Papa from "papaparse";

enum Grade {
  F = "F",
  E = "E",
  D = "D",
  C = "C",
  B = "B",
  A = "A",
  S = "S",
}

interface ResultType {
  registerNo: number;
  studentName: string;
  branch: string;
  semester: number;
  course: string;
  examType: "Regular" | "Supplementary";
  attendance: "Present" | "Absent";
  withheld: "Withheld" | "With held for Malpractice" | null;
  iMark: number | null;
  grade: Grade | null;
  result: "P" | "F" | null;
}

interface FormattedType {
  registerNo: number;
  studentName: string;
  branch: string;
  semester: number;
  examType: "Regular" | "Supplementary";
  grades: {
    [key: string]: Grade | "Absent" | null;
  };
  withheld: "Withheld" | "With held for Malpractice" | null;
}

export const parseCsv = (
  inputFile: File,
  onSuccess: (e: ResultType[]) => void = (e) => console.log(e),
  onError: (e: string) => void = (e) => console.log(e)
) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    if (!event.target) return;
    const file = event.target.result;
    if (typeof file !== "string") return;
    let allLines = file.split(/\r\n|\n/);
    // Reading line by line
    if (allLines.length < 2) {
      onError("File is empty");
      return;
    }

    allLines[0] = allLines[0].replaceAll(";", ",");

    // Parse the csv data
    Papa.parse<ResultType>(allLines.join("\n"), {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader(header) {
        // change header to camelCase
        header = header
          .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          })
          .replace(/\s+/g, "");
        return header;
      },
      complete(results) {
        onSuccess(results.data);
      },
    });
  };
  reader.onerror = (error) => {
    onError("Error reading file");
  };
  reader.readAsText(inputFile);
};

export const formatData = (data: ResultType[]): FormattedType[] => {
  const formattedData: FormattedType[] = [];
  data.forEach((item) => {
    const index = formattedData.findIndex(
      (i) => i.registerNo === item.registerNo
    );
    if (index === -1) {
      formattedData.push({
        registerNo: item.registerNo,
        studentName: item.studentName,
        branch: item.branch,
        semester: item.semester,
        examType: item.examType,
        grades: {
          [item.course]: item.grade
            ? item.grade
            : item.attendance === "Absent"
            ? "Absent"
            : item.withheld === "With held for Malpractice"
            ? Grade.F
            : null,
        },
        withheld: item.withheld,
      });
    } else {
      formattedData[index].grades[item.course] = item.grade;
    }
  });
  return formattedData;
};

// function to get All courses from FormattedType[]
export const getAllCourses = (data: FormattedType[]): string[] => {
  const courses: string[] = [];
  data.forEach((item) => {
    Object.keys(item.grades).forEach((course) => {
      if (!courses.includes(course)) {
        courses.push(course);
      }
    });
  });
  return courses;
};
