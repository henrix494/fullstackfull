import { Redirect, Stack } from "expo-router";
import { ReactNode } from "react";
import { Text } from "react-native";
import { useAuthSession } from "../providers/AuthProvider";

export default function RootLayout(): ReactNode {
  const { token, isLoading } = useAuthSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!token?.current) {
    return <Redirect href="/login/index" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
