import axiosClient from "@/api/axiosClient";
import { User } from "@/src/features/auth/store/authStore";

export type LoginResponse = {
  token: string;
  user: User;
};

export type RegisterResponse = {
  token: string;
  user: User;
};

export const AuthService = {
  login: async (email: string, password: string) => {
    const { data } = await axiosClient.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const { data } = await axiosClient.post<RegisterResponse>(
      "/auth/register",
      {
        name,
        email,
        password,
      },
    );
    return data;
  },
};
