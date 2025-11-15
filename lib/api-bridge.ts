import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/global";

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
});

// type body aman tanpa any
type JsonBody = { [key: string]: unknown };
type BodyType = JsonBody | string | FormData;

// ========== ERROR HANDLER GLOBAL ==========
const handleError = (error: unknown) => {
  const err = error as AxiosError<{ message: string; code: number }>;

  if (err.response) {
    return {
      status: false,
      message: err.response.data.message || "Terjadi kesalahan",
      code: err.response.data.code || err.code,
    };
  }

  return {
    status: false,
    message: "Network error",
  };
};

// ========== GET ==========
export const get = async (url: string, token: string) => {
  try {
    const result = await axiosInstance.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { status: true, data: result.data };
  } catch (error) {
    return handleError(error);
  }
};

// ========== HEADER BUILDER TANPA ANY ==========
const buildHeaders = (data: BodyType, token: string) => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// ========== POST ==========
export const post = async (url: string, data: BodyType, token: string) => {
  try {
    const result = await axiosInstance.post(url, data, {
      headers: buildHeaders(data, token),
    });

    return { status: true, data: result.data };
  } catch (error) {
    return handleError(error);
  }
};

// ========== PUT ==========
export const put = async (url: string, data: BodyType, token: string) => {
  try {
    const result = await axiosInstance.put(url, data, {
      headers: buildHeaders(data, token),
    });

    return { status: true, data: result.data };
  } catch (error) {
    return handleError(error);
  }
};

// ========== DELETE ==========
export const drop = async (url: string, token: string) => {
  try {
    const result = await axiosInstance.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { status: true, data: result.data };
  } catch (error) {
    return handleError(error);
  }
};
