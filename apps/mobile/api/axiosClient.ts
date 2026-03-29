import axios from "axios";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import { useCommunicationRequestStore } from "@/src/features/communication-request/store/communicationRequestStore";
import { Platform } from "react-native";

const mobileBaseURL =
  `${process.env.EXPO_PUBLIC_API_URL}/api` || "http://localhost:3001/api";

const webBaseUrl = "http://localhost:3001/api";

const baseURL = Platform.OS === "web" ? webBaseUrl : mobileBaseURL;

const axiosClient = axios.create({
  baseURL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const visitorToken = useCommunicationRequestStore.getState().visitorToken;

    if (token || visitorToken) {
      config.headers.Authorization = `Bearer ${token || visitorToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
