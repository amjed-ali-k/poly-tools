// Config
const minSubjectsPerHall = 1;
const maxSubjectsPerHall = 2;

// Models & interfaces

interface SubjectStudentCount {
  count: number;
  subjectCode: number;
  examType: ExamType;
}

// enum ExamType {
//   THEORY,
//   DRAWING,
// }

interface Assignment {
  hallName: string;
  students: AssignedStudents[];
}

interface AssignedStudents {
  subjectCode: number;
  count: number;
}

// Track subject assignments
const subjectAssignments: Record<string, Record<number, number>> = {};

// Input data
const students: SubjectStudentCount[] = [];
const examHalls: ExamHall[] = [];

// Main logic
/**
 * Assign students to exam halls
 */
function assignStudentsToHalls(
  students: SubjectStudentCount[],
  examHalls: ExamHall[]
): Assignment[] {
  // Initialize data structures
  const assignedHalls: Record<string, AssignedStudents[]> = {};
  const remainingSeats = structuredClone(examHalls);

  // Sort students by exam type
  // This allows assigning drawing students first
  students.sort((a, b) => {
    return a.examType - b.examType;
  });

  // Iterate over students
  for (const student of students) {
    // Find a hall with available seats
    let hallName: number | string = "";

    if (student.examType === ExamType.THEORY) {
      // Check for theory seats
      hallName = getHallWithSeats(remainingSeats, "theoryOnlySeats");
    } else if (student.examType === ExamType.DRAWING) {
      // Check for drawing seats
      hallName = getHallWithSeats(remainingSeats, "drawingOnlySeats");
    } else {
      // Check for common seats
      hallName = getHallWithSeats(remainingSeats, "commonSeats");
    }

    // Ensure subject limits before assigning
    if (hallName && !isHallEligible(hallName.toString(), student.subjectCode)) {
      hallName = "";
    }

    // Assign student if hall available
    if (hallName) {
      // Add student data for hall
      assignedHalls[hallName] = assignedHalls[hallName] || [];
      assignedHalls[hallName].push({
        subjectCode: student.subjectCode,
        count: student.count,
      });

      // Update subject assignments
      updateSubjectAssignments(
        hallName.toString(),
        student.subjectCode,
        student.count
      );

      // Update remaining seats
      const hall = remainingSeats.find((h) => h.name === hallName);
      if (hall) {
        hall.commonSeats -= student.count;

        if (student.examType === ExamType.THEORY) {
          hall.theoryOnlySeats -= student.count;
        } else if (student.examType === ExamType.DRAWING) {
          hall.drawingOnlySeats -= student.count;
        }
      }
    }
    console.log("Hall:", hallName);
    console.log("Remaining seats:", remainingSeats);
  }

  // Format output
  const assignments: Assignment[] = [];

  Object.keys(assignedHalls).forEach((hallName) => {
    assignments.push({
      hallName,
      students: assignedHalls[hallName],
    });
  });

  return assignments;
}

// Helper functions

/**
 * Check if assigning to hall meets subject limits
 */
function isHallEligible(hallName: string, subjectCode: number) {
  const assignedSubjects = subjectAssignments[hallName] || {};
  const subjectCount = Object.keys(assignedSubjects).length;

  return (
    subjectCount >= minSubjectsPerHall && subjectCount < maxSubjectsPerHall
  );
}

/**
 * Update subject assignments map when assigning student
 */
function updateSubjectAssignments(
  hallName: string,
  subjectCode: number,
  count: number
) {
  subjectAssignments[hallName] = subjectAssignments[hallName] || {};
  subjectAssignments[hallName][subjectCode] = count;
}

/**
 * Find hall with available seats of given type
 */
function getHallWithSeats(halls: ExamHall[], seatType: string) {
  for (const hall of halls) {
    //@ts-ignore
    if (hall[seatType] > 0) {
      return hall.name;
    }
  }

  return "";
}

// Add tests

// Test data
const testStudents: SubjectStudentCount[] = [
  { count: 50, subjectCode: 101, examType: ExamType.THEORY },
  { count: 30, subjectCode: 102, examType: ExamType.DRAWING },
  { count: 20, subjectCode: 103, examType: ExamType.THEORY },
];

const testHalls: ExamHall[] = [
  { name: 109, commonSeats: 40, theoryOnlySeats: 10, drawingOnlySeats: 0 },
  { name: 120, commonSeats: 60, theoryOnlySeats: 0, drawingOnlySeats: 30 },
  { name: 221, commonSeats: 50, theoryOnlySeats: 20, drawingOnlySeats: 10 },
];

// Helper functions

function getStudentCountsBySubject(students: SubjectStudentCount[]) {
  const counts: Record<number, number> = {};

  for (let student of students) {
    counts[student.subjectCode] =
      (counts[student.subjectCode] || 0) + student.count;
  }

  return counts;
}

function getTotalSeats(hall: ExamHall) {
  return hall.commonSeats + hall.theoryOnlySeats + hall.drawingOnlySeats;
}

// Validation tests

function validateAssignmentCounts(
  assignments: Assignment[],
  expectedCounts: Record<number, number>
) {
  // Track assigned counts
  const assignedCounts: Record<number, number> = {};

  for (let assignment of assignments) {
    for (let assigned of assignment.students) {
      assignedCounts[assigned.subjectCode] =
        (assignedCounts[assigned.subjectCode] || 0) + assigned.count;
    }
  }

  for (let subjectCode in expectedCounts) {
    const expected = expectedCounts[subjectCode];
    const assigned = assignedCounts[subjectCode] || 0;
    if (expected !== assigned) {
      throw new Error(`Invalid count for subject ${subjectCode}`);
    }
  }
}

function validateHallCapacities(assignments: Assignment[], halls: ExamHall[]) {
  // Get total seats used per hall
  const hallUsage: Record<string, number> = {};

  for (let assignment of assignments) {
    let totalStudents = 0;

    for (let assigned of assignment.students) {
      totalStudents += assigned.count;
    }

    hallUsage[assignment.hallName] = totalStudents;
  }

  // Check against capacities
  for (let hall of halls) {
    const totalSeats = getTotalSeats(hall);
    const usedSeats = hallUsage[hall.name] || 0;

    if (usedSeats > totalSeats) {
      throw new Error(`Hall ${hall.name} over capacity!`);
    }
  }
}

function validateSubjectDistribution(assignments: Assignment[]) {
  for (let assignment of assignments) {
    // Get subject codes
    const subjects = assignment.students.map((s) => s.subjectCode);

    // Validate min/max constraints
    const uniqueSubjects = new Set(subjects).size;
    if (uniqueSubjects < minSubjectsPerHall) {
      throw new Error(`Too few subjects in ${assignment.hallName}`);
    }

    if (uniqueSubjects > maxSubjectsPerHall) {
      throw new Error(`Too many subjects in ${assignment.hallName}`);
    }
  }
}

// Usage

try {
  const assignments = assignStudentsToHalls(students, examHalls);
  console.log(assignments);
  const expectedCounts = getStudentCountsBySubject(testStudents);
  validateAssignmentCounts(assignments, expectedCounts);
  validateHallCapacities(assignments, testHalls);
  validateSubjectDistribution(assignments);
  console.log("All tests passed!");
} catch (error: any) {
  console.log("Test failed: ", error.message);
}
