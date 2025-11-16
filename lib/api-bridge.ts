import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/global";

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
});

export const get = async (url: string, token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const result = await axios.get(url, {
      headers,
    });
    return {
      status: true,
      data: result.data,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string; code: number }>;
    if (err.response) {
      console.log(err.response.data.message);
      return {
        status: false,
        message: `${err.code}: something wrong`,
      };
    }
    console.log(err.response);
    return {
      status: false,
      message: `Something were wrong: ${error}`,
    };
  }
};

export const post = async (
  url: string,
  data: Record<string, unknown> | string | FormData,
  token: string
) => {
  try {
    const isFormData = data instanceof FormData;

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    };

    const payload = isFormData ? data : JSON.stringify(data);

    const result = await axiosInstance.post(url, payload, { headers });

    return {
      status: true,
      data: result.data,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string; code: number }>;
    if (err.response) {
      console.log(err.response.data.message);
      return {
        status: false,
        message: `${err.code}: something wrong`,
      };
    }
    console.log(err.response);
    return {
      status: false,
      message: `Something were wrong: ${error}`,
    };
  }
};

export const put = async (
  url: string,
  data: string | FormData,
  token: string
) => {
  try {
    const type: string =
      typeof data == "string" ? "application/json" : "multipart/form-data";
    const result = await axiosInstance.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}` || "",
        "Content-Type": type,
      },
    });
    return {
      status: true,
      data: result.data,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string; code: number }>;
    if (err.response) {
      console.log(err.response.data.message);
      return {
        status: false,
        message: `${err.code}: something wrong`,
      };
    }
    console.log(err.response);
    return {
      status: false,
      message: `Something were wrong`,
    };
  }
};

export const drop = async (url: string, token: string) => {
  try {
    const result = await axiosInstance.delete(url, {
      headers: {
        Authorization: `Bearer ${token}` || "",
      },
    });
    return {
      status: true,
      data: result.data,
    };
  } catch (error) {
    const err = error as AxiosError<{ message: string; code: number }>;
    if (err.response) {
      console.log(err.response.data.message);
      return {
        status: false,
        message: `${err.code}: something wrong`,
      };
    }
    console.log(err.response);
    return {
      status: false,
      message: `Something were wrong`,
    };
  }
};
