enum ExamType {
  THEORY,
  DRAWING,
}

interface Student {
  regNo: number;
  subjectCode: number;
  examType: ExamType; // Add examType to student
}

interface ExamHall {
  commonSeats: number;
  theoryOnlySeats: number;
  drawingOnlySeats: number;
  name: number;
}

interface ExamAssignment {
  student: Student;
  hall: ExamHall;
}

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
  students: Student[],
  halls: ExamHall[],
  maxSubjectsPerHall: number = Infinity
): ExamAssignment[] {
  const assignments: ExamAssignment[] = [];
  const unassignedStudents: Student[] = [];

  //   // Total Subjects count
  //    const subjectCounts: { [key: string]: number } = students.reduce(
  //      (acc: { [key: string]: number }, curr) => {
  //        if (!acc[curr.subjectCode]) {
  //          acc[curr.subjectCode] = 0;
  //        }
  //        acc[curr.subjectCode]++;
  //        return acc;
  //      },
  //      {}
  //    );

  // Group students by exam type
  const theoryStudents = orderStudentsAsPerMaxSubjects(
    students.filter((student) => student.examType === ExamType.THEORY)
  );
  const drawingStudents = orderStudentsAsPerMaxSubjects(
    students.filter((student) => student.examType === ExamType.DRAWING)
  );

  // Sort students by subject code
  //   theoryStudents.sort((a, b) => a.subjectCode - b.subjectCode);
  //   drawingStudents.sort((a, b) => a.subjectCode - b.subjectCode);

  // Order Students by subject code and maxSubjectsPerHall.
  // if maxSubjectsPerHall is 4 then array should be [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, ...]

  function orderStudentsAsPerMaxSubjects(st: Student[]) {
    const spitedStudents: Student[][] = [];
    const allSubjects: number[] = unique(st, (e) => e.subjectCode).map(
      (e) => e.subjectCode
    );
    const _maxSubs = Math.min(maxSubjectsPerHall, allSubjects.length);
    allSubjects.forEach((s, i) => {
      spitedStudents.push(st.filter((e) => e.subjectCode === s));
    });

    const orderedStudents: Student[] = [];
    st.forEach((_, i) => {
      orderedStudents.push(...spitedStudents[i % _maxSubs]);
    });

    return orderedStudents;
  }

  // Sort halls by available theoryOnlySeats and drawingOnlySeats
  const sortedHalls = [...halls].sort((a, b) => {
    return (
      a.theoryOnlySeats +
      a.drawingOnlySeats -
      (b.theoryOnlySeats + b.drawingOnlySeats)
    );
  });

  // Function to assign students to seats
  function assignStudentsToHall(studentsToAssign: Student[], hall: ExamHall) {
    for (const student of studentsToAssign) {
      if (student.examType === ExamType.THEORY && hall.theoryOnlySeats > 0) {
        hall.theoryOnlySeats--;
      } else if (
        student.examType === ExamType.DRAWING &&
        hall.drawingOnlySeats > 0
      ) {
        hall.drawingOnlySeats--;
      } else if (hall.commonSeats > 0) {
        hall.commonSeats--;
      } else {
        unassignedStudents.push(student);
      }

      assignments.push({ student, hall });
    }
  }

  // Assign theory students to halls
  for (const hall of sortedHalls) {
    if (theoryStudents.length === 0) break;
    const theoryStudentsInHall = theoryStudents.splice(0, hall.theoryOnlySeats);
    assignStudentsToHall(theoryStudentsInHall, hall);
  }

  // Assign drawing students to halls
  for (const hall of sortedHalls) {
    if (drawingStudents.length === 0) break;
    const drawingStudentsInHall = drawingStudents.splice(
      0,
      hall.drawingOnlySeats
    );
    assignStudentsToHall(drawingStudentsInHall, hall);
  }

  // Assign any remaining students (both theory and drawing) to halls
  const remainingStudents = [...theoryStudents, ...drawingStudents];
  for (const hall of sortedHalls) {
    if (remainingStudents.length === 0) break;
    const studentsInHall = remainingStudents.splice(0, hall.commonSeats);
    assignStudentsToHall(studentsInHall, hall);
  }

  // Handle any remaining unassigned students when there are more students than available seats
  if (remainingStudents.length > 0) {
    unassignedStudents.push(...remainingStudents);
  }

  // Console log the unassigned students
  console.log("Unassigned Students:", unassignedStudents);

  return assignments;
}

const subjectCode = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010];

function draw(e: Array<number>): number {
  const index = Math.floor(Math.random() * e.length);
  return e[index];
}

const students: Student[] = Array(500)
  .fill(0)
  .map((_, i) => {
    const sub = draw(subjectCode);
    return {
      regNo: i + 1,
      subjectCode: sub,
      examType: ExamType.THEORY,
    };
  });

console.log("Students Count: ", students.length);

const halls: ExamHall[] = Array(10)
  .fill(0)
  .map((_, i) => ({
    commonSeats: 5,
    theoryOnlySeats: 30,
    drawingOnlySeats: 0,
    name: i,
  }));

console.log("Seats count: ");

const _halls: ExamHall[] = JSON.parse(JSON.stringify(halls));
const result = assignStudentsToHalls(students, halls, 4);

console.clear();

// print the students count according to subjects and types
console.table(
  students.reduce((acc, curr) => {
    const key = `${curr.subjectCode}-${curr.examType}`;
    //@ts-ignore
    if (!acc[key]) {
      //@ts-ignore
      acc[key] = 0;
    }
    //@ts-ignore
    acc[key]++;
    return acc;
  }, {})
);

// print the remaining seats in each hall
console.table(
  _halls.map((h) => {
    return {
      hall: h.name,
      commonSeats: h.commonSeats,
      theoryOnlySeats: h.theoryOnlySeats,
      usedTheorySeats: result.filter(
        (r) => r.hall.name === h.name && r.student.examType === ExamType.THEORY
      ).length,
      drawingOnlySeats: h.drawingOnlySeats,
      usedDrawingSeats: result.filter(
        (r) => r.hall.name === h.name && r.student.examType === ExamType.DRAWING
      ).length,
    };
  })
);

console.table(
  _halls.map((h) => {
    const hallResult = subjectCode.reduce((acc, s) => {
      return {
        ...acc,
        [s.toString()]: result.filter(
          (r) => r.hall.name === h.name && r.student.subjectCode === s
        ).length,
      };
    }, {});
    return {
      hall: h.name,
      ...hallResult,
    };
  })
);
