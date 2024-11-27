import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const client = async (path: string) => {
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.error);
    } else {
      console.error("알 수 없는 에러가 발생했습니다.");
    }
  }
};
