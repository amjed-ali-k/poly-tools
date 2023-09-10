import { CourseDetailsApiRes } from "@/app/api/secure/sbte-result/course-details/route";
import axios from "axios";

export const fetchGrades = async (courseCodes: string[]) => {
  try {
    const res = await axios.post<CourseDetailsApiRes>(
      "/api/secure/sbte-result/course-details",
      {
        courses: courseCodes,
      }
    );
    return res.data;
  } catch (error) {
    return null;
  }
};
