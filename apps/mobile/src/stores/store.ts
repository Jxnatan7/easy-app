import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Cookies from "js-cookie";
import { StateStorage } from "zustand/middleware";

const webCookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window !== "undefined") {
      return Cookies.get(name) || null;
    }
    return null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof window !== "undefined") {
      Cookies.set(name, value, {
        expires: 7,
        secure: window.location.protocol === "https:",
        sameSite: "strict",
      });
    }
  },
  removeItem: (name: string): void => {
    if (typeof window !== "undefined") {
      Cookies.remove(name);
    }
  },
};

const webLocalStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(name);
    }
    return null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(name);
    }
  },
};

const mobileSecureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await SecureStore.getItemAsync(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

const mobileAsyncStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await AsyncStorage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};

export const secureStorage: StateStorage =
  Platform.OS === "web" ? webCookieStorage : mobileSecureStorage;

export const generalStorage: StateStorage =
  Platform.OS === "web" ? webLocalStorage : mobileAsyncStorage;
