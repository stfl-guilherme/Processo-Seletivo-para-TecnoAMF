import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {

    fetch("http://192.168.1.116:8000/api/login/", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        username: username,
        password: password
      })

    })
    .then(res => res.json())
    .then(async data => {

      if (data.token) {

        await AsyncStorage.setItem("token", data.token);

        router.replace("/");

      } else {

        alert("Usuário ou senha inválidos");

      }

    });

  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Usuário"
        style={styles.input}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Senha"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    padding: 30
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center"
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  }

});