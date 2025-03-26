"use server";
import { cookies } from "next/headers";
import { fetchApi } from "./fetch";

export const setAccessToken = async (token: string) => {
  const cookie = await cookies();
  cookie.set("access_token", `${token}`, {
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const fetchActionApi = async <T>(path: string, options: RequestInit & {}) => {
  return fetchApi<T>(path, options);
};