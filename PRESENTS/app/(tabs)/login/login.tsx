import storage from "@/storage/store";
import { useMutation } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function Login() {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (loginData: { username: string; password: string }) => {
      const res = await fetch("http://10.100.102.11:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      if (!res.ok) {
        throw new Error("Invalid email or password");
      }
      return res.json();
    },
    onSuccess: async (data) => {
      try {
        await storage.save({
          key: "user",
          data: data,
          expires: null,
        });
        setError(null);
        router.replace("/"); // Go to home screen AFTER save
      } catch (err) {
        console.log("Failed to save user:", err);
        setError("Something went wrong. Please try again.");
      }
    },
    onError: (err: any) => {
      console.log(err);
      setError(err.message || "Login failed");
    },
  });

  const handleSubmit = () => {
    if (username === "" || password === "") {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    mutation.mutate({ username, password });
  };

  return (
    <LinearGradient
      colors={["#232526", "#414345"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TextInput
          style={[
            styles.input,
            error && username === "" ? styles.inputError : null,
          ]}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[
            styles.input,
            error && password === "" ? styles.inputError : null,
          ]}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.button}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.or}>or</Text>
        <TouchableOpacity
          onPress={() => {
            router.replace("/(tabs)/sign-up/sign-up");
          }}
          style={styles.signupButton}
        >
          <Text style={styles.signupText}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#18181b",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 12,
    padding: Platform.OS === "ios" ? 16 : 12,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    width: "100%",
    backgroundColor: "#4f8cff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  or: {
    color: "#aaa",
    marginVertical: 8,
    fontSize: 14,
  },
  signupButton: {
    padding: 10,
  },
  signupText: {
    color: "#4f8cff",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  errorText: {
    color: "red",
    marginBottom: 12,
    fontWeight: "bold",
    fontSize: 15,
    alignSelf: "flex-start",
  },
});
