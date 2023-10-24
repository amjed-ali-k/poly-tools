import {
  ExamType,
  assignHallsCustom,
  getSeatsByType,
} from "./../customHallAsiign";

describe("exam hall allocation", () => {
  // Sample exam halls
  const sampleHalls = [
    {
      name: 101,
      commonSeats: 10,
      theoryOnlySeats: 5,
      drawingOnlySeats: 5,
    },
    {
      name: 102,
      commonSeats: 10,
      theoryOnlySeats: 10,
      drawingOnlySeats: 10,
    },
  ];

  // Sample student counts
  const sampleStudents = [
    {
      count: 5,
      branch: "CS",
      subjectCode: 101,
      examType: ExamType.THEORY,
    },
    {
      count: 7,
      branch: "ME",
      subjectCode: 102,
      examType: ExamType.DRAWING,
    },
  ];

  test("allocates seats correctly", () => {
    const result = assignHallsCustom(sampleStudents, sampleHalls);

    // Hall 101 should have 3 seats allocated for subject 101 (theory)
    expect(result[101][101]).toEqual(3);

    // Hall 102 should have 3 seats allocated for subject 102 (drawing)
    expect(result[102][102]).toEqual(3);
  });

  test("gets correct seats by type", () => {
    const hall = sampleHalls[0];

    // Should return 5 theory only seats
    expect(getSeatsByType(hall, ExamType.THEORY)).toEqual(5);

    // Should return 5 drawing only seats
    expect(getSeatsByType(hall, ExamType.DRAWING)).toEqual(5);
  });
});
