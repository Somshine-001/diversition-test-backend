import { cookies } from "next/headers";

export const fetchApi = async <T>(
  path: string,
  options: RequestInit &{ 
  } = {
    method: "GET",
  }
): Promise<FetchResponse<T>> => {
  const coockie = await cookies();
  const accessToken = coockie.get("access_token")?.value || "";
  const headers = {
    Authorization: `Bearer ${accessToken || ""}`,
  };

  const url = `${process.env.API_URL}${path}`;
  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const error = await response.json();
      return { data: error, status: response.status };
    }
    const result = await response.json();
    return {
      data: result,
      status: response.status,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { data: null, status: 500, error: error.message };
    }
    return { data: null, status: 500, error: "Unknown error" };
  }
};

interface FetchResponse<T> {
  data: T | null;
  status: number;
  error?: string;
}