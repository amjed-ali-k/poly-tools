export function validateFileType(file: File) {
  const fileName = file.name;
  const idxDot = fileName.lastIndexOf(".") + 1;
  const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
  if (extFile == "csv") {
    return true;
  } else {
    return false;
  }
}

export const sampleInput = `"Register No";"Student Name";Branch;Semester;Course;"Exam Type";Attendance;Withheld;IMark;Grade;Result
2201041312,"JUNAID .M","Electronics Engineering",1,"1001-Communication Skills in English",Regular,Present,,40,F,F
2201041312,"JUNAID .M","Electronics Engineering",1,"1002-Mathematics I",Regular,Present,,30,B,P`;

export const validateCSV = (data: string): string | true => {
  const lines = data.split("\n").map((line) => line.replace("\r", ""));
  const header = lines[0].split(";");

  if (header.length < 11) return "Invalid header length";
  if (
    !(
      header[0].includes(`Register No`) &&
      header[1].includes(`Student Name`) &&
      header[2].includes(`Branch`) &&
      header[3].includes(`Semester`) &&
      header[4].includes(`Course`) &&
      header[5].includes(`Exam Type`) &&
      header[6].includes(`Attendance`) &&
      header[7].includes(`Withheld`) &&
      header[8].includes(`IMark`) &&
      header[9].includes(`Grade`) &&
      header[10].includes(`Result`)
    )
  )
    return "Invalid header";

  if (lines.length < 3) return "File is empty";

  for (let i = 1; i < lines.length - 1; i++) {
    const line = lines[i].split(",");
    if (line.length !== 11) return `Invalid line ${i - 1} length`;
    // line[0] = should be a number
    if (isNaN(Number(line[0]))) return `Invalid line ${i - 1} register number`;
    // line[3] = should be a number
    if (isNaN(Number(line[3]))) return `Invalid line ${i - 1} semester`;
    // line[5] = should be either Regular or Supplementary
    if (line[5] !== "Regular" && line[5] !== "Supplementary")
      return `Invalid line ${i - 1} exam type`;
    // line[6] = should be either Present or Absent
    if (line[6] !== "Present" && line[6] !== "Absent")
      return `Invalid line ${i - 1} attendance`;
    // line[7] = should be either empty or "Withheld" | "With held for Malpractice"
    if (
      [
        "",
        "Withheld",
        "With held for Malpractice",
        '"Withheld"',
        '"With held for Malpractice"',
      ].includes(line[7]) === false
    ) {
      return `Invalid line ${i - 1} withheld`;
    }
    // line[8] = should be a number if line[7] is empty
    if (line[7] === "" && isNaN(Number(line[8])))
      return `Invalid line ${i - 1} internal mark`;
    // line[9] = should be grades if line[7] is empty
    if (
      line[7] === "" &&
      !["F", "E", "D", "C", "B", "A", "S", "Absent", "Withheld", ""].includes(
        line[9]
      )
    )
      return `Invalid line ${i - 1} grade`;
    // line[10] = should be either Pass or Fail
    if (
      line[7] === "" &&
      line[10] !== "P" &&
      line[10] !== "F" &&
      line[10] !== ""
    )
      return `Invalid line ${i - 1} result`;
  }
  return true;
};

export const preProcessCSV = async (data: File): Promise<File> => {
  // read data as csv

  const _data = await data.text();
  const lines = _data.split("\n");

  // remove /r from end of all lines if present
  const _lines = lines
    .map((line) => line.replace("\r", ""))
    .filter((line) => line !== "");

  // retrun as file
  return new File(_lines, data.name, { type: data.type });
};
