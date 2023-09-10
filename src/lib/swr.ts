`use client`;

import { ProfileApiResponse } from "@/app/api/secure/profile/route";
import axios from "axios";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useGet = <T>(url: string) => {
  return useSWR<T>(url, fetcher);
};

export const usePermenantGet = <T>(url: string) => {
  return useSWRImmutable<T>(url, fetcher);
};

export const useProfile = () => {
  return usePermenantGet<ProfileApiResponse>("/api/secure/profile");
};
