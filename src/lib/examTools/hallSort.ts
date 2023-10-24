import { ExamType } from "./customHallAsiign";

enum SeatType {
  NOT_USABLE,
  THEORY_ONLY,
  DRAWING_ONLY,
  THEORY_AND_DRAWING, // Add THEORY_AND_DRAWING seat type
}

interface Student {
  regNo: number;
  subjectCode: number;
  examType: ExamType; // Add examType to student
}

type AllocatedSeat = Student & {
  row: number;
  seat: number;
};

type ExamHallStucture = SeatType[][]; // Use SeatType enum in ExamHallStucture

/**
 * Allocate seats for students in an exam hall based on their exam type and seat availability.
 * @param {Student[]} students - An array of students with their subject codes and exam types.
 * @param {SeatType[][]} examHall - A 2D array representing the exam hall with seat types.
 * @returns {AllocatedSeat[]} An array of seating assignments for students including row and seat numbers.
 */
function allocateSeats(
  students: Student[],
  examHall: ExamHallStucture
): AllocatedSeat[] {
  // Initialize a record to track available seats for each subject
  const availableSeats: {
    [key: number]: { row: number; seat: number }[];
  } = {};

  // Initialize an array to store seating assignments
  const seating: AllocatedSeat[] = [];

  for (const student of students) {
    // Initialize availableSeats for the student's subject code if not already created
    if (!availableSeats[student.subjectCode]) {
      availableSeats[student.subjectCode] = [];
    }

    let maxDistance = -1;
    let chosenSeat: { row: number; seat: number } | null = null;

    for (let row = 0; row < examHall.length; row++) {
      for (let seat = 0; seat < examHall[row].length; seat++) {
        const seatType = examHall[row][seat];

        // Check if the seat is usable for the student's exam type
        if (
          (student.examType === ExamType.THEORY &&
            (seatType === SeatType.THEORY_ONLY ||
              seatType === SeatType.THEORY_AND_DRAWING)) ||
          (student.examType === ExamType.DRAWING &&
            (seatType === SeatType.DRAWING_ONLY ||
              seatType === SeatType.THEORY_AND_DRAWING))
        ) {
          // Calculate the distance to other students already seated
          const distanceToOtherStudents = availableSeats[
            student.subjectCode
          ].reduce(
            (minDist, otherSeat) =>
              Math.min(
                minDist,
                Math.abs(otherSeat.row - row) + Math.abs(otherSeat.seat - seat)
              ),
            Infinity
          );

          // If this seat is farther from other students, choose it
          if (distanceToOtherStudents > maxDistance) {
            maxDistance = distanceToOtherStudents;
            chosenSeat = { row, seat };
          }
        }
      }
    }

    if (chosenSeat) {
      // Assign the chosen seat to the student
      seating.push({ ...student, ...chosenSeat });
      examHall[chosenSeat.row][chosenSeat.seat] = SeatType.NOT_USABLE;
      availableSeats[student.subjectCode].push(chosenSeat);
    } else {
      // If no suitable seat is available, check for a "THEORY_AND_DRAWING" seat
      for (let row = 0; row < examHall.length; row++) {
        for (let seat = 0; seat < examHall[row].length; seat++) {
          if (examHall[row][seat] === SeatType.THEORY_AND_DRAWING) {
            // Calculate the distance to other students already seated
            const distanceToOtherStudents = availableSeats[
              student.subjectCode
            ].reduce(
              (minDist: number, otherSeat: { row: number; seat: number }) =>
                Math.min(
                  minDist,
                  Math.abs(otherSeat.row - row) +
                    Math.abs(otherSeat.seat - seat)
                ),
              Infinity
            );

            // If this seat is farther from other students, choose it
            if (distanceToOtherStudents > maxDistance) {
              maxDistance = distanceToOtherStudents;
              chosenSeat = { row, seat };
            }
          }
        }
      }

      if (chosenSeat) {
        // Assign the chosen seat to the student
        seating.push({ ...student, ...chosenSeat });
        examHall[chosenSeat.row][chosenSeat.seat] = SeatType.NOT_USABLE;
        availableSeats[student.subjectCode].push(chosenSeat);
      } else {
        console.log("No usable seat available for student:");
        console.log(student);
      }
    }
  }

  return seating;
}

const examHall: ExamHallStucture = [
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.THEORY_AND_DRAWING,
    SeatType.THEORY_AND_DRAWING,
  ],
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.NOT_USABLE,
    SeatType.THEORY_AND_DRAWING,
  ],
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.THEORY_AND_DRAWING,
    SeatType.NOT_USABLE,
  ],
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.NOT_USABLE,
    SeatType.THEORY_AND_DRAWING,
  ],
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.THEORY_AND_DRAWING,
    SeatType.NOT_USABLE,
  ],
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.NOT_USABLE,
    SeatType.THEORY_AND_DRAWING,
  ],
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.THEORY_AND_DRAWING,
    SeatType.NOT_USABLE,
  ],
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.NOT_USABLE,
    SeatType.THEORY_AND_DRAWING,
  ],
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.NOT_USABLE,
    SeatType.THEORY_AND_DRAWING,
  ],
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.THEORY_AND_DRAWING,
    SeatType.NOT_USABLE,
  ],
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.NOT_USABLE,
    SeatType.THEORY_AND_DRAWING,
  ],
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.THEORY_AND_DRAWING,
    SeatType.NOT_USABLE,
  ],
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.NOT_USABLE,
    SeatType.THEORY_AND_DRAWING,
  ],
  [
    SeatType.THEORY_AND_DRAWING,
    SeatType.THEORY_AND_DRAWING,
    SeatType.NOT_USABLE,
  ],
];

const students: Student[] = [
  { subjectCode: 2002, regNo: 1, examType: ExamType.THEORY },
  { subjectCode: 2001, regNo: 2, examType: ExamType.THEORY },
  { subjectCode: 2001, regNo: 3, examType: ExamType.THEORY },
  { subjectCode: 2005, regNo: 4, examType: ExamType.THEORY },
  { subjectCode: 2005, regNo: 5, examType: ExamType.THEORY },
  { subjectCode: 2002, regNo: 6, examType: ExamType.THEORY },
  { subjectCode: 2005, regNo: 7, examType: ExamType.THEORY },
  { subjectCode: 2002, regNo: 8, examType: ExamType.THEORY },
  { subjectCode: 2001, regNo: 9, examType: ExamType.THEORY },
  { subjectCode: 2005, regNo: 10, examType: ExamType.THEORY },
  { subjectCode: 2005, regNo: 11, examType: ExamType.THEORY },
  { subjectCode: 2001, regNo: 12, examType: ExamType.THEORY },
  { subjectCode: 2005, regNo: 13, examType: ExamType.THEORY },
  { subjectCode: 2005, regNo: 14, examType: ExamType.THEORY },
  { subjectCode: 2001, regNo: 15, examType: ExamType.THEORY },
  { subjectCode: 2002, regNo: 16, examType: ExamType.THEORY },
  { subjectCode: 2002, regNo: 17, examType: ExamType.THEORY },
  { subjectCode: 2002, regNo: 18, examType: ExamType.THEORY },
  { subjectCode: 2001, regNo: 19, examType: ExamType.THEORY },
  { subjectCode: 2001, regNo: 20, examType: ExamType.THEORY },
  { subjectCode: 2001, regNo: 21, examType: ExamType.THEORY },
  { subjectCode: 2001, regNo: 22, examType: ExamType.THEORY },
  { subjectCode: 2002, regNo: 23, examType: ExamType.THEORY },
  { subjectCode: 2002, regNo: 24, examType: ExamType.THEORY },
  { subjectCode: 2002, regNo: 25, examType: ExamType.THEORY },
  { subjectCode: 2002, regNo: 26, examType: ExamType.THEORY },
];

const seating = allocateSeats(students, examHall);

// Display seating as a table with rows and seats
const seatingTable = seating.reduce(
  (acc, student) => {
    acc[student.row][student.seat] = `${student.subjectCode}-${student.regNo}`;
    return acc;
  },
  examHall.map((row) => row.map(() => ""))
);

console.log(seatingTable);
