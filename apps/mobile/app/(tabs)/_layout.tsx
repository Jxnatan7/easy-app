import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { useAuthStore } from "@/src/features/auth/store/authStore";

export default function TabLayout() {
  const token = useAuthStore((s) => s.token);

  if (!token) {
    return <Redirect href="/init" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "light",
        headerShown: false,
        tabBarShowLabel: false,
        animation: "fade",
      }}
    >
      <Tabs.Screen
        name="user"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="chat" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
