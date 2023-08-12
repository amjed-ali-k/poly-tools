import Papa from "papaparse";
import * as xlsx from "xlsx-js-style";

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

type courseName = string;
interface FormattedType {
  registerNo: number;
  studentName: string;
  branch: string;
  semester: number;
  examType: "Regular" | "Supplementary";
  grades: {
    [key: courseName]: AllGrades | null;
  };
  // withheld: "Withheld" | "With held for Malpractice" | null;
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
            ? "Malpractice"
            : item.withheld === '"With held for Malpractice"'
            ? "Malpractice"
            : item.withheld === "Withheld"
            ? "Withheld"
            : null,
        },
        // withheld:
        //   item.withheld === "With held for Malpractice"
        //     ? "With held for Malpractice"
        //     : item.withheld === '"With held for Malpractice"'
        //     ? "With held for Malpractice"
        //     : item.withheld === "Withheld"
        //     ? "Withheld"
        //     : null,
      });
    } else {
      formattedData[index].grades[item.course] = item.grade
        ? item.grade
        : item.attendance === "Absent"
        ? "Absent"
        : item.withheld === "With held for Malpractice"
        ? "Malpractice"
        : item.withheld === '"With held for Malpractice"'
        ? "Malpractice"
        : item.withheld === "Withheld"
        ? "Withheld"
        : null;
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

// convert formatted data to xlsx using cell coloring. Also put title "SBTE FORMATTER by Amjed Ali" on Top of the sheet
export const convertToXlsx = (data: FormattedType[]): xlsx.WorkBook => {
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(
    wb,
    createResultWorksheet(data.filter((e) => e.examType === "Regular")),
    "Regular Result"
  );
  xlsx.utils.book_append_sheet(
    wb,
    createResultWorksheet(data.filter((e) => e.examType === "Supplementary")),
    "Supplementary Result"
  );

  return wb;
};

const getHeaderRowObj = (title: string) => {
  return {
    t: "s",
    v: title,
    s: {
      font: { sz: 10, bold: true, color: { rgb: "000000" } },
      alignment: { horizontal: "center", vertical: "center" },
    },
  };
};

const calculateGradesCountInEachCourse = (data: FormattedType[]) => {
  const courses = getAllCourses(data);
  const gradesCount: { [key: string]: { [key: string]: number } } = {};
  courses.forEach((course) => {
    gradesCount[course] = {
      S: 0,
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      Withheld: 0,
      Malpractice: 0,
      Absent: 0,
    };
  });
  data.forEach((item) => {
    Object.keys(item.grades).forEach((course) => {
      const val = item.grades[course];
      val && item.grades && gradesCount[course][val]++;
    });
  });

  // convert it into array [{course name, A, B, C, D, E, F, Withheld, With held for Malpractice, Absent}]
  const gradesCountArr: {
    Subject: string;
    S: number;
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
    Withheld: number;
    Malpractice: number;
    Absent: number;
  }[] = [];

  Object.keys(gradesCount).forEach((course) => {
    gradesCountArr.push({
      Subject: course,
      ...gradesCount[course],
    } as any);
  });
  return gradesCountArr;
};

const createResultWorksheet = (data: FormattedType[]) => {
  const courses = getAllCourses(data);
  // sort according to Student name
  const courseLength = courses.length || 5;

  const headerPreDefinedCols = [
    "registerNo",
    "studentName",
    "branch",
    "semester",
  ];
  const ws = xlsx.utils.aoa_to_sheet<string>([
    ["SBTE Result Formatter"],
    ["By Amjed Ali (https://github.com/amjed-ali-k"],
  ]);

  // Add stickey row on top of the sheet with headers
  ws["!rows"] = [{ hpx: 30 }, { hpx: 20 }];
  ws["!freeze"] = {
    xSplit: "A",
    ySplit: 4,
    topLeftCell: "A2",
    activePane: "bottomLeft",
  };
  // Merge top row
  ws["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: headerPreDefinedCols.length + courseLength },
    },
    {
      s: { r: 1, c: 0 },
      e: { r: 1, c: headerPreDefinedCols.length + courseLength },
    },
    {
      s: { r: 2, c: headerPreDefinedCols.length },
      e: { r: 2, c: headerPreDefinedCols.length + courseLength - 1 },
    },
  ];

  ws["A1"] = {
    t: "s",
    v: "SBTE RESULT FORMATTER",
    s: {
      font: {
        sz: 20,
        bold: true,
        color: {
          rgb: "ffffff",
        },
      },
      fill: { fgColor: { rgb: "2a6099" } },
      alignment: { horizontal: "center", vertical: "bottom" },
    },
  };

  ws["A2"] = {
    t: "s",
    v: "By Amjed Ali K (https://github.com/amjed-ali-k)",
    s: {
      font: {
        sz: 8,
        bold: true,
        color: {
          rgb: "ffffff",
        },
      },
      fill: { fgColor: { rgb: "2a6099" } },
      alignment: { horizontal: "center", vertical: "top" },
    },
  };

  courses.forEach((course, index) => {
    const _c = course.split("-");
    ws[
      xlsx.utils.encode_cell({ r: 3, c: index + headerPreDefinedCols.length })
    ] = {
      t: "s",
      v: _c[_c.length - 1],
      s: { font: { sz: 10, bold: true, alignment: { wrapText: true } } },
    };
  });

  ws["!rows"][2] = { hpx: 20 };
  ws["!rows"][3] = { hpx: 20 };

  if (!data || data.length === 0) {
    // TODO: Fix this message is not showing
    ws["!merges"].push({
      s: { r: 2, c: 0 },
      e: { r: 5, c: headerPreDefinedCols.length + courseLength },
    });
    ws["A3"] = getHeaderRowObj("No student result found");
    ws["J6"] = getHeaderRowObj("No student result found");
    return ws;
  }

  const reFormattedData = data
    .map((item) => {
      return {
        registerNo: item.registerNo,
        studentName: item.studentName,
        branch: item.branch,
        semester: item.semester,
        ...item.grades,
      };
    })
    .sort((a, b) => {
      if (a.studentName < b.studentName) {
        return -1;
      }
      if (a.studentName > b.studentName) {
        return 1;
      }
      return 0;
    });

  ws["!merges"].push(
    ...Array(headerPreDefinedCols.length)
      .fill(0)
      .map((_, i) => ({
        s: { r: 2, c: i },
        e: { r: 3, c: i },
      }))
  );
  ws["!merges"].push({
    s: { r: 0, c: 0 },
    e: { r: 0, c: headerPreDefinedCols.length + courseLength },
  });

  xlsx.utils.sheet_add_json(ws, reFormattedData, {
    skipHeader: true,
    origin: {
      c: 0,
      r: 4,
    },
    header: [...headerPreDefinedCols, ...courses],
  });

  // store each grade count in each subject at bottom of the sheet
  const gradeData = calculateGradesCountInEachCourse(data);
  xlsx.utils.sheet_add_json(ws, gradeData, {
    // skipHeader: false,
    origin: {
      c: 2, // start from 4th column so later it can be merged
      r: reFormattedData.length + 7,
    },

    header: [
      "Subject",
      "S",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "Withheld",
      "Malpractice",
      "Absent",
    ],
  });

  Array(gradeData.length + 1)
    .fill(0)
    .forEach((_, index) => {
      const currentRow = reFormattedData.length + 7 + index;
      // merge first 4 coulums of each stats row, so long subject names can fit
      ws["!merges"]?.push({
        s: {
          r: currentRow,
          c: 0,
        },
        e: {
          r: currentRow,
          c: 2,
        },
      });

      // Bold each subject name
      const cell =
        ws[
          xlsx.utils.encode_cell({
            r: currentRow,
            c: 2,
          })
        ];
      if (cell)
        cell.s = {
          ...cell.s,
          font: {
            sz: 11,
            bold: true,
            alignment: { wrapText: true },
          },
        };
    });

  // Add header on top of the sheet
  ws["A3"] = getHeaderRowObj("Reg No");
  ws["B3"] = getHeaderRowObj("Student Name");
  ws["C3"] = getHeaderRowObj("Branch");
  ws["D3"] = getHeaderRowObj("Sem");
  ws["E3"] = getHeaderRowObj("Subjects");

  const range = xlsx.utils.decode_range(ws["!ref"] || "A1:A1");

  const gradesPos = {
    gradesStartCol: headerPreDefinedCols.length,
    gradesEndCol: headerPreDefinedCols.length + courseLength,
    gradesStartRow: 4,
    gradesEndRow: reFormattedData.length + 3,
  };

  iterateThroughCells(ws, 4, range.e.r, 0, range.e.c, (C, R, _cell) => {
    // if cell includes in grades range
    let cell = _cell;
    if (
      C >= gradesPos.gradesStartCol &&
      C <= gradesPos.gradesEndCol &&
      R >= gradesPos.gradesStartRow &&
      R <= gradesPos.gradesEndRow
    ) {
      // if cell undefined
      if (!cell) {
        // create a cell in worksheet
        xlsx.utils.sheet_add_aoa(ws, [[""]], {
          origin: {
            c: C,
            r: R,
          },
        });
        // get the newly created cell
        cell = ws[xlsx.utils.encode_cell({ r: R, c: C })] as xlsx.CellObject;
      }
      const stl: {
        alignment?: { horizontal: string };
        fill?: { fgColor: { rgb: string } };
      } = {
        alignment: { horizontal: "center" },
      };

      if (cell.t === "s" && cell.v === "Absent") {
        stl.fill = { fgColor: { rgb: "ff79e7" } };
      }
      if (cell.t === "s" && cell.v === "F") {
        stl.fill = { fgColor: { rgb: "ff9797" } };
      }
      if (cell.t === "s" && cell.v === "Withheld") {
        stl.fill = { fgColor: { rgb: "fba7cf" } };
      }
      if (cell.t === "s" && cell.v === "Malpractice") {
        stl.fill = { fgColor: { rgb: "d7fc00" } };
      }
      cell.s = { ...cell.s, ...stl };
    }

    if (!cell) return;

    cell.s = {
      ...cell.s,
      border: {
        top: { style: "thin", color: { rgb: "242424" } },
        left: { style: "thin", color: { rgb: "242424" } },
        bottom: { style: "thin", color: { rgb: "242424" } },
        right: { style: "thin", color: { rgb: "242424" } },
      },
    };

    if (!cell.s?.fill?.fgColor) {
      cell.s.fill = { fgColor: { rgb: "f7f7f6" } };
    }
    if (!cell.s?.font?.color) {
      cell.s.font = {
        ...cell.s.font,
        color: {
          rgb: "00000",
        },
      };
    }

    // set cell width to minimum text width for first 2 columns
    if (cell.t === "s" && [1, 2].includes(C)) {
      if (!ws["!cols"]) ws["!cols"] = [];
      if (cell.v)
        ws["!cols"][C] = {
          wch: cell.v.toString().length + 5,
        };
    }
  });

  return ws;
};

const iterateThroughCells = (
  ws: xlsx.WorkSheet,
  startRow: number,
  endRow: number,
  startColumn: number,
  endColumn: number,
  func: (C: number, R: number, e?: xlsx.CellObject) => void
) => {
  for (let R = startRow; R <= endRow; ++R) {
    for (let C = startColumn; C <= endColumn; ++C) {
      const cell: xlsx.CellObject | undefined =
        ws[xlsx.utils.encode_cell({ r: R, c: C })];
      func(C, R, cell);
    }
  }
};
