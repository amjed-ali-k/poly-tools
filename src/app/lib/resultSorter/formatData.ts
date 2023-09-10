import Papa from "papaparse";
import { AllGrades, FormattedType, ResultType } from "./types";
import { fetchGrades } from "./externalApi";

export const formatData = async (
  data: ResultType[],
  isCgpa: boolean = true
): Promise<FormattedType[]> => {
  const formattedData: FormattedType[] = [];
  const allCourses: string[] = [];
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
          [getCourseCode(item.course)]: {
            internal: item.iMark || 0,
            name: item.course,
            grade: item.grade
              ? item.grade
              : item.attendance === "Absent"
              ? "Absent"
              : item.withheld === "With held for Malpractice"
              ? "Malpractice"
              : item.withheld === '"With held for Malpractice"'
              ? "Malpractice"
              : item.withheld === "Withheld"
              ? "Withheld"
              : null,
          },
        },
      });
    } else {
      formattedData[index].grades[getCourseCode(item.course)] = {
        internal: item.iMark || 0,
        name: item.course,
        grade: item.grade
          ? item.grade
          : item.attendance === "Absent"
          ? "Absent"
          : item.withheld === "With held for Malpractice"
          ? "Malpractice"
          : item.withheld === '"With held for Malpractice"'
          ? "Malpractice"
          : item.withheld === "Withheld"
          ? "Withheld"
          : null,
      };
    }
    if (
      item.course &&
      item.course !== "" &&
      !allCourses.includes(item.course)
    ) {
      allCourses.push(item.course);
    }
  });

  if (isCgpa && allCourses.length > 0) {
    const courseDetails = await fetchGrades(
      allCourses.map((e) => getCourseCode(e))
    );
    if (!courseDetails) return formattedData;
    formattedData.forEach((element, i) => {
      let totalCredits = 0;
      let totalPoints = 0;
      Object.keys(element.grades).map((e) => {
        const course = courseDetails.find((l) => l.code === getCourseCode(e));
        if (!course) return;
        totalCredits += course?.credits || 0;
        totalPoints +=
          (course?.credits || 0) *
          getGradePoint(element.grades[getCourseCode(e)].grade);
      });

      formattedData[i].cgpa = (totalPoints / totalCredits).toFixed(2);
    });
  }
  return formattedData;
};

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

    allLines[0] =
      "registerNo,studentName,branch,semester,course,examType,attendance,withheld,iMark,grade,result";

    // Parse the csv data
    Papa.parse<ResultType>(allLines.join("\n"), {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader(header, i) {
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

// function to get All courses from FormattedType[]
export const getAllCourses = (data: FormattedType[]): string[] => {
  const courses: string[] = [];
  data.forEach((item) => {
    Object.values(item.grades).forEach(({ name: course }) => {
      if (!courses.includes(course)) {
        courses.push(course);
      }
    });
  });
  return courses;
};

export const getCourseCode = (courseName: string) => {
  return courseName.split("-")[0];
};

type GPT = {
  [key: string]: number;
};
const gradePointTable: GPT = {
  S: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
  Absent: 0,
  Withheld: 0,
  Malpratice: 0,
};

const getGradePoint = (grade: string | null) => {
  if (!grade) return 0;

  return gradePointTable[grade];
};
