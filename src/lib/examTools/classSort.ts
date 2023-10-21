enum ExamType {
  THEORY,
  DRAWING,
}

interface Subjects {
  count: number;
  subjectCode: number;
  examType: ExamType; // Add examType to student
}

interface ExamHall {
  commonSeats: number;
  theoryOnlySeats: number;
  drawingOnlySeats: number;
  name: number;
}

type ExamAssignment = {
  studentCount?: {
    [key: string]: number;
  };
} & ExamHall;

const unique: <T, K extends string | number | symbol>(
  array: readonly T[],
  toKey?: ((item: T) => K) | undefined
) => T[] = (array, toKey) => {
  const valueMap = array.reduce((acc, item) => {
    const key = toKey ? toKey(item) : item;
    //@ts-ignore
    if (acc[key]) return acc;
    //@ts-ignore
    acc[key] = item;
    return acc;
  }, {});
  return Object.values(valueMap);
};

function assignStudentsToHalls(
  subjects: Subjects[],
  halls: ExamHall[],
  maxSubjectsPerHall: number = Infinity
): ExamAssignment[] {
  const assignments: ExamAssignment[] = [...halls];

  // Get total seats avaliable in all halls by exam type
  const totalSeatsByType = halls.reduce(
    (acc, curr) => {
      acc.theory += curr.theoryOnlySeats + curr.commonSeats;
      acc.drawing += curr.drawingOnlySeats + curr.commonSeats;
      return acc;
    },
    { theory: 0, drawing: 0 }
  );

  // Get the total students count by exam type and subject
  const totalStudentsByType = subjects.reduce(
    (acc, curr) => {
      acc.theory += curr.examType === ExamType.THEORY ? curr.count : 0;
      acc.drawing += curr.examType === ExamType.DRAWING ? curr.count : 0;
      return acc;
    },
    { theory: 0, drawing: 0 }
  );

  subjects.sort((a, b) => b.count - a.count);

  function getRemainingSeats(h: ExamHall[], type?: ExamType) {
    return halls.reduce((acc, curr) => {
      acc +=
        curr.commonSeats +
        (type && type === ExamType.DRAWING
          ? curr.drawingOnlySeats
          : curr.theoryOnlySeats);
      return acc;
    }, 0);
  }

  function getRemainingStudents(s: Subjects[]) {
    return subjects.reduce((acc, curr) => {
      acc += curr.count;
      return acc;
    }, 0);
  }

  function assigntoHalls(
    subs: Subjects[],
    _halls: ExamHall[],
    type?: ExamType
  ) {
    const maxSubsPerHall = Math.min(maxSubjectsPerHall, subs.length);
    while (
      getRemainingSeats(_halls, type) > 0 &&
      getRemainingStudents(subs) > 0
    ) {
      const _subs = subs.slice(0, maxSubsPerHall);
      const _h = _halls.filter(
        (e) =>
          e.commonSeats > 0 ||
          (type === ExamType.DRAWING
            ? e.drawingOnlySeats > 0
            : e.theoryOnlySeats > 0)
      );

      // assign students to halls

      _h.forEach((h) => {
        _subs.forEach((s) => {
          if (s.count < 1) return;

          if (type === ExamType.DRAWING && h.drawingOnlySeats > 0) {
            const diff = Math.abs(h.drawingOnlySeats - s.count);
            h.drawingOnlySeats -= diff;
            s.count -= diff;
            const assing = assignments.find((e) => e.name === h.name)!;
            assing.studentCount = {
              ...assing.studentCount,
              [s.subjectCode]:
                (assing.studentCount?.[s.subjectCode] || 0) + diff,
            };
          } else if (type === ExamType.THEORY && h.theoryOnlySeats > 0) {
            const diff = Math.abs(h.theoryOnlySeats - s.count);
            h.theoryOnlySeats -= diff;
            s.count -= diff;
            const assing = assignments.find((e) => e.name === h.name)!;
            assing.studentCount = {
              ...assing.studentCount,
              [s.subjectCode]:
                (assing.studentCount?.[s.subjectCode] || 0) + diff,
            };
          } else if (h.commonSeats > 0) {
            const diff = Math.abs(h.commonSeats - s.count);
            h.commonSeats -= diff;
            s.count -= diff;
            const assing = assignments.find((e) => e.name === h.name)!;
            assing.studentCount = {
              ...assing.studentCount,
              [s.subjectCode]:
                (assing.studentCount?.[s.subjectCode] || 0) + diff,
            };
          }
        });
      });
    }
  }

  if (totalStudentsByType.drawing > totalSeatsByType.drawing) {
    // assign students to drawing halls first
    const drawingHalls = halls.filter((h) => h.drawingOnlySeats > 0);
    const drawingSubjects = subjects.filter(
      (s) => s.examType === ExamType.DRAWING
    );
    assigntoHalls(drawingSubjects, drawingHalls, ExamType.DRAWING);
  } else {
    // assign students to theory halls first
    const theoryHalls = halls.filter((h) => h.theoryOnlySeats > 0);
    const theorySubjects = subjects.filter(
      (s) => s.examType === ExamType.THEORY
    );
    assigntoHalls(theorySubjects, theoryHalls, ExamType.THEORY);
  }

  // assign students to common halls
  const commonHalls = halls.filter((h) => h.commonSeats > 0);
  const commonSubjects = subjects;
  assigntoHalls(commonSubjects, commonHalls);

  return assignments;
}

// const subjectCode = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010];

// function draw(e: Array<number>): number {
//   const index = Math.floor(Math.random() * e.length);
//   return e[index];
// }

// const students: Student[] = Array(500)
//   .fill(0)
//   .map((_, i) => {
//     const sub = draw(subjectCode);
//     return {
//       regNo: i + 1,
//       subjectCode: sub,
//       examType: ExamType.THEORY,
//     };
//   });

// console.log("Students Count: ", students.length);

// const halls: ExamHall[] = Array(10)
//   .fill(0)
//   .map((_, i) => ({
//     commonSeats: 5,
//     theoryOnlySeats: 30,
//     drawingOnlySeats: 0,
//     name: i,
//   }));

// console.log("Seats count: ");

// const _halls: ExamHall[] = JSON.parse(JSON.stringify(halls));
// const result = assignStudentsToHalls(students, halls, 4);

// console.clear();

// // print the students count according to subjects and types
// console.table(
//   students.reduce((acc, curr) => {
//     const key = `${curr.subjectCode}-${curr.examType}`;
//     //@ts-ignore
//     if (!acc[key]) {
//       //@ts-ignore
//       acc[key] = 0;
//     }
//     //@ts-ignore
//     acc[key]++;
//     return acc;
//   }, {})
// );

// // print the remaining seats in each hall
// console.table(
//   _halls.map((h) => {
//     return {
//       hall: h.name,
//       commonSeats: h.commonSeats,
//       theoryOnlySeats: h.theoryOnlySeats,
//       usedTheorySeats: result.filter(
//         (r) => r.hall.name === h.name && r.student.examType === ExamType.THEORY
//       ).length,
//       drawingOnlySeats: h.drawingOnlySeats,
//       usedDrawingSeats: result.filter(
//         (r) => r.hall.name === h.name && r.student.examType === ExamType.DRAWING
//       ).length,
//     };
//   })
// );

// console.table(
//   _halls.map((h) => {
//     const hallResult = subjectCode.reduce((acc, s) => {
//       return {
//         ...acc,
//         [s.toString()]: result.filter(
//           (r) => r.hall.name === h.name && r.student.subjectCode === s
//         ).length,
//       };
//     }, {});
//     return {
//       hall: h.name,
//       ...hallResult,
//     };
//   })
// );
