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
  studentCount?: {
    [key: string]: number;
  };
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
  const assignmentMap: { [key: number]: ExamAssignment } = {};
  halls.forEach((hall) => (assignmentMap[hall.name] = hall));

  const drawingHalls = halls.filter((h) => h.drawingOnlySeats > 0);
  const theoryHalls = halls.filter((h) => h.theoryOnlySeats > 0);
  const commonHalls = halls.filter((h) => h.commonSeats > 0);

  const assignToHall = (subject: Subjects, hall: ExamHall, type: ExamType) => {
    const diff =
      type === ExamType.DRAWING
        ? Math.min(hall.drawingOnlySeats, subject.count)
        : Math.min(hall.theoryOnlySeats, subject.count);

    hall[type === ExamType.DRAWING ? "drawingOnlySeats" : "theoryOnlySeats"] -=
      diff;
    subject.count -= diff;

    if (!hall.studentCount) {
      hall.studentCount = {};
    }
    hall.studentCount[subject.subjectCode] =
      (hall.studentCount[subject.subjectCode] || 0) + diff;
  };

  subjects.sort((a, b) => b.count - a.count);

  for (const subject of subjects) {
    while (subject.count > 0) {
      if (subject.examType === ExamType.DRAWING) {
        for (const hall of drawingHalls) {
          if (hall.drawingOnlySeats > 0) {
            assignToHall(subject, hall, ExamType.DRAWING);
            if (maxSubjectsPerHall > 1) {
              const theoryHall = theoryHalls.find((h) => h.theoryOnlySeats > 0);
              if (theoryHall) {
                assignToHall(subject, theoryHall, ExamType.THEORY);
              }
            }
            break;
          }
        }
      } else {
        for (const hall of theoryHalls) {
          if (hall.theoryOnlySeats > 0) {
            assignToHall(subject, hall, ExamType.THEORY);
            if (maxSubjectsPerHall > 1) {
              const drawingHall = drawingHalls.find(
                (h) => h.drawingOnlySeats > 0
              );
              if (drawingHall) {
                assignToHall(subject, drawingHall, ExamType.DRAWING);
              }
            }
            break;
          }
        }
      }
      for (const hall of commonHalls) {
        if (hall.commonSeats > 0) {
          assignToHall(subject, hall, ExamType.THEORY);
          if (maxSubjectsPerHall > 1) {
            const drawingHall = drawingHalls.find(
              (h) => h.drawingOnlySeats > 0
            );
            if (drawingHall) {
              assignToHall(subject, drawingHall, ExamType.DRAWING);
            }
          }
        }
      }
    }
  }

  return assignments;
}

const subjectCode = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010];

function draw(e: Array<number>): number {
  const index = Math.floor(Math.random() * e.length);
  return e[index];
}

const fakeSubjects: Subjects[] = subjectCode.map((_, i) => {
  return {
    count: 30,
    subjectCode: _,
    examType: ExamType.THEORY,
  };
});

console.log(
  "Students Count: ",
  fakeSubjects.reduce((acc, curr) => acc + curr.count, 0)
);

const halls: ExamHall[] = Array(10)
  .fill(0)
  .map((_, i) => ({
    commonSeats: 5,
    theoryOnlySeats: 30,
    drawingOnlySeats: 0,
    name: i,
  }));

const _halls: ExamHall[] = JSON.parse(JSON.stringify(halls));
const result = assignStudentsToHalls(fakeSubjects, halls, 4);

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

console.table(
  _halls.map((h) => {
    return {
      hall: h.name,
      ...result.find((r) => r.name === h.name)?.studentCount,
    };
  })
);
