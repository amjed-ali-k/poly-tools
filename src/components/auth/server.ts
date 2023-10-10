"use server";
import axios from "axios";
import { hankoApiUrl } from "./vars";

export const getUserId = async () => {
  // get user details from Hanko
  const {
    data: { id },
  } = await axios.get<{ id: string }>(`${hankoApiUrl}/me`);

  return id;
};
