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

function assignStudentsToHallsType1(
  subjects: Subjects[],
  halls: ExamHall[],
  maxSubjectsPerHall: number | undefined = undefined
): ExamAssignment[] {
  const assignments: ExamAssignment[] = [...halls];
  const assignmentMap: { [key: number]: ExamAssignment } = {};
  halls.forEach((hall) => (assignmentMap[hall.name] = hall));

  const remainingSubjects: Subjects[] = [...subjects];
  const availableHalls = [...halls];

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

  if (maxSubjectsPerHall === undefined) {
    // Assign students from all subjects to each hall
    for (const hall of availableHalls) {
      for (const subject of remainingSubjects) {
        const canAssign =
          subject.examType === ExamType.DRAWING
            ? hall.drawingOnlySeats > 0
            : hall.theoryOnlySeats > 0;

        if (canAssign) {
          assignToHall(subject, hall, subject.examType);
        }
      }
    }
  } else {
    // Distribute students from different subjects across multiple halls
    remainingSubjects.sort((a, b) => b.count - a.count);

    while (remainingSubjects.length > 0) {
      for (const hall of availableHalls) {
        if (remainingSubjects.length === 0) {
          break;
        }

        const subjectsForHall = remainingSubjects.splice(0, maxSubjectsPerHall);
        for (const subject of subjectsForHall) {
          const canAssign =
            subject.examType === ExamType.DRAWING
              ? hall.drawingOnlySeats > 0
              : hall.theoryOnlySeats > 0;

          if (canAssign) {
            assignToHall(subject, hall, subject.examType);
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
const result = assignStudentsToHallsType1(fakeSubjects, halls, 4);

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
