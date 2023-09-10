import * as xlsx from "xlsx-js-style";
import { FormattedType, OptionsType, ResultType } from "./resultSorter/types";
import { getAllCourses } from "./resultSorter/formatData";
import Color from "colorjs.io";
import { mapEntries } from "radash";
// convert formatted data to xlsx using cell coloring. Also put title "SBTE FORMATTER by Amjed Ali" on Top of the sheet
export const convertToXlsx = (
  data: FormattedType[],
  options: OptionsType
): xlsx.WorkBook => {
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(
    wb,
    createResultWorksheet(
      data.filter((e) => e.examType === "Regular"),
      options
    ),
    "Regular Result"
  );
  xlsx.utils.book_append_sheet(
    wb,
    createResultWorksheet(
      data.filter((e) => e.examType === "Supplementary"),
      options
    ),
    "Supplementary Result"
  );

  return wb;
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
    Object.values(item.grades).forEach(({ name, grade }) => {
      grade && gradesCount[name][grade]++;
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
type TreformatedData = {
  registerNo: number;
  studentName: string;
  branch: string;
  semester: number;
  cgpa?: string;
};
const createResultWorksheet = (data: FormattedType[], options: OptionsType) => {
  const { isCgpa, sortType } = options;

  const courses = getAllCourses(data);

  const courseLength = courses.length || 7;

  const headerPreDefinedCols = [
    "registerNo",
    "studentName",
    "branch",
    "semester",
  ];

  const ws = xlsx.utils.aoa_to_sheet<string>([[""], [""]]);

  // Intialize Merges and Rows
  ws["!merges"] = [];
  ws["!rows"] = [];

  // Empty data template
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

  // Create New JS Object to add into sheet
  const reFormattedData = data
    .map((item) => {
      const _obj: TreformatedData = {
        branch: item.branch,
        registerNo: item.registerNo,
        studentName: item.studentName,
        semester: item.semester,
        ...mapEntries(item.grades, (_key, value) => [value.name, value.grade]), // change here to add internal mark
      };
      let obj: TreformatedData = _obj;

      if (item.cgpa && isCgpa) {
        obj = { ..._obj, cgpa: item.cgpa };
      }
      return obj;
    })
    .sort((a, b) => {
      if ((a[sortType] || 1) < (b[sortType] || 1)) {
        return -1;
      }
      if ((a[sortType] || 1) > (b[sortType] || 1)) {
        return 1;
      }
      return 0;
    });

  // JS Object to Sheet
  const hdrs = [...headerPreDefinedCols, ...courses];
  xlsx.utils.sheet_add_json(ws, reFormattedData, {
    skipHeader: true,
    origin: {
      c: 0,
      r: 4,
    },
    header: isCgpa ? [...hdrs, "cgpa"] : hdrs,
  });

  // Course name modifier
  courses.forEach((course, index) => {
    const _c = course.split("-");
    ws[
      xlsx.utils.encode_cell({ r: 3, c: index + headerPreDefinedCols.length })
    ] = {
      t: "s",
      v: _c[_c.length - 1],
      s: {
        font: { sz: 10, bold: true, alignment: { wrapText: true } },
        border: fullBorder,
      },
    };
  });

  addGradeDetailsToSheet(ws, data, reFormattedData);

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

    // border all active cells
    cell.s = {
      ...cell.s,
      border: fullBorder,
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

  sheetStyles(
    ws,
    headerPreDefinedCols.length,
    courseLength,
    reFormattedData.length,
    isCgpa
  );

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

const addGradeDetailsToSheet = (
  ws: xlsx.WorkSheet,
  data: FormattedType[],
  reFormattedData: TreformatedData[]
) => {
  // store each grade count in each subject at bottom of the sheet
  const gradeData = calculateGradesCountInEachCourse(data);
  const header = [
    "Subject",
    "",
    "",
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
  ];
  xlsx.utils.sheet_add_json(ws, gradeData, {
    // skipHeader: false,
    origin: {
      c: 0,
      r: reFormattedData.length + 7,
    },
    header,
  });

  Array(gradeData.length + 1)
    .fill(0)
    .forEach((_, index) => {
      const currentRow = reFormattedData.length + 7 + index;
      // merge first 4 coulums of each stats row, so long subject names can fit
      ws["!merges"] = [...(ws["!merges"] as [])];
      ws["!merges"].push({
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
            c: 0,
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

  // Style title row
  header.forEach((e, i) => {
    const cell =
      ws[
        xlsx.utils.encode_cell({
          r: reFormattedData.length + 7,
          c: i,
        })
      ];
    if (cell) {
      cell.s = {
        ...cell.s,
        font: {
          sz: 11,
          bold: true,
          alignment: { wrapText: true },
          color: { rgb: "ffffff" },
        },
        fill: { fgColor: { rgb: "342a06" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  });
};

const sheetStyles = (
  ws: xlsx.WorkSheet,
  firstColLength: number,
  courseLength: number,
  dataLength: number,
  isCgpa = false
) => {
  // Add Large row on top of the sheet
  ws["!rows"] = [...(ws["!rows"] as [])];
  ws["!rows"][0] = { hpx: 35 };
  ws["!rows"][1] = { hpx: 20 };

  ws["!merges"] = [...(ws["!merges"] as [])];
  // Merge Student detail headers (Name, RegNo, Branch, Sem, etc..)
  ws["!merges"].push(
    ...Array(firstColLength)
      .fill(0)
      .map((_, i) => ({
        s: { r: 2, c: i },
        e: { r: 3, c: i },
      }))
  );

  // Merge top row and Subject Columns
  ws["!merges"] = [
    ...ws["!merges"],
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: firstColLength + courseLength },
    },
    {
      s: { r: 1, c: 0 },
      e: { r: 1, c: firstColLength + courseLength },
    },
    {
      s: { r: 2, c: firstColLength },
      e: { r: 2, c: firstColLength + courseLength - 1 },
    },
  ];

  // Add Top Title
  ws["A1"] = {
    t: "s",
    v: "SBTE Tools",
    s: {
      font: {
        sz: 20,
        bold: true,
        color: {
          rgb: "ffffff",
        },
      },
      fill: { fgColor: { rgb: "8d1d75" } },
      alignment: { horizontal: "center", vertical: "bottom" },
    },
  };

  ws["A2"] = {
    t: "s",
    v: "By Amjed Ali K (https://sbte-tools.vercel.app)",
    s: {
      font: {
        sz: 8,
        bold: true,
        color: {
          rgb: "ffffff",
        },
      },
      fill: { fgColor: { rgb: "a6318c" } },
      alignment: { horizontal: "center", vertical: "top" },
    },
  };

  // Add header on top of the sheet
  ws["A3"] = getHeaderRowObj("Reg No");
  ws["B3"] = getHeaderRowObj("Student Name");
  ws["C3"] = getHeaderRowObj("Branch");
  ws["D3"] = getHeaderRowObj("Sem");
  ws["E3"] = getHeaderRowObj("Subjects");

  if (isCgpa) {
    ws[
      xlsx.utils.encode_cell({
        r: 2,
        c: firstColLength + courseLength,
      })
    ] = getHeaderRowObj("SGPA");
    ws["!merges"].push({
      s: { r: 2, c: firstColLength + courseLength },
      e: { r: 3, c: firstColLength + courseLength },
    });
  }

  ws["!freeze"] = {
    xSplit: "A",
    ySplit: 3,
    topLeftCell: "A1",
    activePane: "bottomLeft",
  };

  {
    isCgpa &&
      iterateThroughCells(
        ws,
        4,
        4 + dataLength,
        firstColLength + courseLength,
        firstColLength + courseLength,
        (C, R, e) => {
          if (!e) return;
          e.s = {
            ...e.s,
            fill: {
              fgColor: {
                rgb: redgreen(parseFloat(e.v as string) / 10)
                  .toString({ format: "hex" })
                  .replace("#", ""),
              },
            },
          };
        }
      );
  }
};

const fullBorder = {
  top: { style: "thin", color: { rgb: "242424" } },
  left: { style: "thin", color: { rgb: "242424" } },
  bottom: { style: "thin", color: { rgb: "242424" } },
  right: { style: "thin", color: { rgb: "242424" } },
};

const getHeaderRowObj = (title: string) => {
  return {
    t: "s",
    v: title,
    s: {
      font: { sz: 10, bold: true, color: { rgb: "000000" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: fullBorder,
    },
  };
};
let color = new Color("#ff6d6d");
let redgreen = color.range("#57d003", {
  space: "srgb", // interpolation space
  hue: "shorter",
});
