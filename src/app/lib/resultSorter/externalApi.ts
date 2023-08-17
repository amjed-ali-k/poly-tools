import { CourseType } from "@/app/api/courseDetails/route";
import axios from "axios";

export const fetchGrades = async (courseCodes: string[]) => {
  try {
    const res = await axios.post<CourseType[]>("/api/courseDetails", {
      courses: courseCodes,
    });
    return res.data;
  } catch (error) {
    return null;
  }
};
