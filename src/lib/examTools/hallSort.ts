interface Student {
  regNo: number;
  subjectCode: number;
}

type ExamHallStructureType = ("USABLE" | "NOT USABLE")[][];

function allocateSeats(
  students: Student[],
  examHall: ExamHallStructureType,
  isStretch: boolean = false
) {
  // Initialize a map to track available seats for each subject
  const availableSeats: Record<number, { row: number; seat: number }[]> = {};

  const seating: {
    regNo: number;
    subjectCode: number;
    row: number;
    seat: number;
  }[] = [];

  let row = 0;
  let seat = 0;

  for (const student of students) {
    if (!availableSeats[student.subjectCode]) {
      availableSeats[student.subjectCode] = [];
    }

    let chosenSeat: { row: number; seat: number } | null = null;

    if (isStretch) {
      let maxDistance = -1;
      for (let r = 0; r < examHall.length; r++) {
        for (let s = 0; s < examHall[r].length; s++) {
          if (examHall[r][s] === "USABLE") {
            const distanceToOtherStudents = availableSeats[
              student.subjectCode
            ].reduce(
              (minDist, otherSeat) =>
                Math.min(
                  minDist,
                  Math.abs(otherSeat.row - r) + Math.abs(otherSeat.seat - s)
                ),
              Infinity
            );

            if (distanceToOtherStudents > maxDistance) {
              maxDistance = distanceToOtherStudents;
              chosenSeat = { row: r, seat: s };
            }
          }
        }
      }
    } else {
      // If isStretch is false, spread students out through both axes
      for (let r = 0; r < examHall.length; r++) {
        for (let s = 0; s < examHall[r].length; s++) {
          if (examHall[r][s] === "USABLE") {
            const studentsInVicinity = availableSeats[
              student.subjectCode
            ].filter(
              (otherSeat) =>
                Math.abs(otherSeat.row - r) <= 1 &&
                Math.abs(otherSeat.seat - s) <= 1
            ).length;

            if (
              !chosenSeat ||
              studentsInVicinity < availableSeats[student.subjectCode].length
            ) {
              chosenSeat = { row: r, seat: s };
            }
          }
        }
      }
    }

    if (chosenSeat) {
      seating.push({ ...student, ...chosenSeat });
      examHall[chosenSeat.row][chosenSeat.seat] = "NOT USABLE"; // Mark the seat as not usable
      availableSeats[student.subjectCode].push(chosenSeat);
    } else {
      console.log("No usable seat available for student:");
      console.log(student);
    }

    if (!isStretch) {
      // If not stretching, move to the next row or seat
      seat++;
      if (seat >= examHall[row].length) {
        row++;
        seat = 0;
      }
    }
  }

  return seating;
}
