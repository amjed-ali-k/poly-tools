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

function assignStudentsToHalls(
  students: Student[],
  halls: ExamHall[]
): ExamAssignment[] {
  const assignments: ExamAssignment[] = [];
  const unassignedStudents: Student[] = [];

  // Group students by exam type
  const theoryStudents = students.filter(
    (student) => student.examType === ExamType.THEORY
  );
  const drawingStudents = students.filter(
    (student) => student.examType === ExamType.DRAWING
  );

  // Sort students by subject code
  theoryStudents.sort((a, b) => a.subjectCode - b.subjectCode);
  drawingStudents.sort((a, b) => a.subjectCode - b.subjectCode);

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
  for (const hall of sortedHalls) {
    if (students.length === 0) break;
    const studentsInHall = students.splice(0, hall.commonSeats);
    assignStudentsToHall(studentsInHall, hall);
  }

  // Handle any remaining unassigned students when there are more students than available seats
  if (students.length > 0) {
    unassignedStudents.push(...students);
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

const students: Student[] = Array(50)
  .fill(0)
  .map((_, i) => {
    const sub = draw(subjectCode);
    return {
      regNo: i + 1,
      subjectCode: sub,
      examType: sub % 2 === 0 ? ExamType.THEORY : ExamType.DRAWING,
    };
  });

console.log("Students Count: ", students.length);

const halls: ExamHall[] = Array(10)
  .fill(0)
  .map((_, i) => ({
    commonSeats: 10,
    theoryOnlySeats: 10,
    drawingOnlySeats: 10,
    name: i,
  }));

console.log("Seats count: ");

const _halls: ExamHall[] = JSON.parse(JSON.stringify(halls));
const result = assignStudentsToHalls(students, halls);

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
