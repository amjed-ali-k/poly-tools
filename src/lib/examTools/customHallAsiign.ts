/**
 * Interface to represent an exam hall
 */
export interface ExamHallSeatsCount {
  commonSeats: number;
  theoryOnlySeats: number;
  drawingOnlySeats: number;
  name: string;
}

/**
 * Enum for exam types
 */
export enum ExamType {
  THEORY,
  DRAWING,
}

/**
 * Interface for student count per exam
 */
export type StudentCount = {
  count: number; // Number of students
  // branch: string; // Branch name
  subjectCode: number; // Subject code
  examType: ExamType; // Exam type
};

type ReturnType = {
  [key: string]: {
    [key: number]: number;
  };
};

/**
 * Allocates exam halls to students
 * @param {StudentCount[]} studentCount - Array of student count per exam
 * @param {ExamHallSeatsCount[]} examHalls - Available exam halls
 * @returns {ReturnType} - Allocated seats per hall and subject
 */
export function assignHallsCustom(
  studentCount: StudentCount[],
  examHalls: ExamHallSeatsCount[]
): ReturnType {
  // Deep copy input to avoid mutation
  const _studentCount = JSON.parse(
    JSON.stringify(studentCount)
  ) as StudentCount[];
  const _examHalls = JSON.parse(
    JSON.stringify(examHalls)
  ) as ExamHallSeatsCount[];

  // Object to store final hall allocation
  const assignedResult: {
    [key: string]: {
      // Key is hall name
      [key: number]: number; // Value is seats allocated per subject
    };
  } = {};

  // Split students based on ExamType
  let drawingCount = 0;
  let theoryCount = 0;

  const drawingStudents = _studentCount.filter(
    (e) => e.examType === ExamType.DRAWING
  );
  const theoryStudents = _studentCount.filter(
    (e) => e.examType === ExamType.THEORY
  );

  // Calculate total students per exam type
  drawingCount = drawingStudents.reduce((acc, curr) => acc + curr.count, 0);
  theoryCount = theoryStudents.reduce((acc, curr) => acc + curr.count, 0);

  // Helper function to allocate seats

  function assignNow(
    halls: ExamHallSeatsCount[],
    students: StudentCount,
    isCommon: boolean = false
  ) {
    if (students.count < 1) return;
    const { count: allowedStudents, examType, subjectCode } = students;
    const getSeats = (e: ExamHallSeatsCount) =>
      getSeatsByType(e, examType, isCommon);
    const allowedHalls = halls
      .filter((h) => getSeatsByType(h, examType, isCommon) > 0)
      .sort((a, b) => getSeats(a) - getSeats(b));

    if (allowedHalls.length < 1) return;

    let remainingSeats = Infinity;
    let remainingStudents = allowedStudents;

    while (remainingSeats > 0 && remainingStudents > 0) {
      const remainingHalls = allowedHalls.filter((e) => getSeats(e) > 0);
      // find minimum seats
      const minSeats =
        remainingHalls.length > 0 ? getSeats(remainingHalls[0]) : 0;
      // find total seats
      remainingSeats = remainingHalls.reduce(
        (acc, curr) => acc + getSeats(curr),
        0
      );

      const seatsToAssign = Math.min(
        minSeats,
        Math.floor(remainingStudents / remainingHalls.length) + 1
      );

      if (seatsToAssign < 1) break;

      try {
        remainingHalls.forEach((hl) => {
          if (!(remainingStudents > 1)) {
            throw "No students remaining";
          }
          const seats2Assign =
            seatsToAssign < remainingStudents
              ? seatsToAssign
              : remainingStudents;

          // Update allocated result object
          if (!assignedResult[hl.name]) {
            assignedResult[hl.name] = {
              [subjectCode]: 0,
            };
          }
          if (!assignedResult[hl.name][subjectCode]) {
            assignedResult[hl.name][subjectCode] = 0;
          }
          assignedResult[hl.name][subjectCode] += seats2Assign;
          students.count -= seats2Assign;
          remainingStudents -= seats2Assign;
          //
          if (isCommon) {
            hl.commonSeats -= seats2Assign;
          } else {
            if (examType === ExamType.DRAWING) {
              hl.drawingOnlySeats -= seats2Assign;
            }
            if (examType === ExamType.THEORY) {
              hl.theoryOnlySeats -= seats2Assign;
            }
          }
        });
      } catch (error) {}
    }
  }

  const studentsToAssign =
    drawingCount > theoryCount
      ? [...theoryStudents, ...drawingStudents]
      : [...drawingStudents, ...theoryStudents];

  studentsToAssign.forEach((e) => {
    assignNow(_examHalls, e);
  });

  studentsToAssign
    .filter((e) => e.count > 0)
    .forEach((st) => {
      assignNow(_examHalls, st, true);
    });

  return assignedResult;
  // Assign remain students into common seats
}

// Helper function to get available seats by exam type
/**
 * Gets available seats by exam type
 * @param {ExamHallSeatsCount} hall - Exam hall object
 * @param {ExamType} examType - Type of exam
 * @param {boolean} isCommon - Flag for common seats
 * @returns {number} - Number of available seats
 */
export function getSeatsByType(
  e: ExamHallSeatsCount,
  examType: ExamType,
  common: boolean = false
) {
  if (common) {
    return e.commonSeats;
  } else {
    if (examType === ExamType.DRAWING) {
      return e.drawingOnlySeats;
    }
    if (examType === ExamType.THEORY) {
      return e.theoryOnlySeats;
    }
  }
  return 0;
}

// // Test cases

// const fakeHalls = [
//   {
//     branch: "EL",
//     count: 10,
//     examType: ExamType.THEORY,
//     subjectCode: 2003,
//   },
//   {
//     branch: "CS",
//     count: 10,
//     examType: ExamType.THEORY,
//     subjectCode: 2004,
//   },
//   {
//     branch: "CS",
//     count: 20,
//     examType: ExamType.DRAWING,
//     subjectCode: 2005,
//   },
// ];

// const fakeStudentCount = [
//   {
//     theoryOnlySeats: 5,
//     drawingOnlySeats: 0,
//     commonSeats: 0,
//     name: "106",
//   },
//   {
//     theoryOnlySeats: 5,
//     drawingOnlySeats: 0,
//     commonSeats: 0,
//     name: "107",
//   },
//   {
//     theoryOnlySeats: 0,
//     drawingOnlySeats: 0,
//     commonSeats: 6,
//     name: "108",
//   },
// ];

// const res = assignHallsCustom(fakeHalls, fakeStudentCount);

// console.log(res);
