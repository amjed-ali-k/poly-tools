// Config
const minSubjectsPerHall = 1;
const maxSubjectsPerHall = 2;

// Models & interfaces

interface Student {
  count: number;
  subjectCode: number;
  examType: ExamType;
}

// enum ExamType {
//   THEORY,
//   DRAWING,
// }

interface ExamHall {
  commonSeats: number;
  theoryOnlySeats: number;
  drawingOnlySeats: number;
  name: number;
}

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
const students: Student[] = [];
const examHalls: ExamHall[] = [];

// Main logic
/**
 * Assign students to exam halls
 */
function assignStudentsToHalls(
  students: Student[],
  examHalls: ExamHall[]
): Assignment[] {
  // Initialize data structures
  const assignedHalls: Record<string, AssignedStudents[]> = {};
  const remainingSeats = structuredClone(examHalls);

  // Sort students by exam type
  // This allows assigning drawing students first
  students.sort((a, b) => {
    // Compare exam types
    if (a.examType < b.examType) return -1;
    if (a.examType > b.examType) return 1;
    return 0;
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
    if ((hall[seatType as keyof ExamHall] as number) > 0) {
      return hall.name;
    }
  }

  return "";
}

// Testing
const assignments = assignStudentsToHalls(students, examHalls);

// Add tests
