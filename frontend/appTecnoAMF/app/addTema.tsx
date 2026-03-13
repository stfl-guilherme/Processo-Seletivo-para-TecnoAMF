import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddTema() {
  const { videoId } = useLocalSearchParams();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  const salvarTema = async () => {
    if (!nome.trim()) {
      alert("Por favor, digite um nome para o tema");
      return;
    }

    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Você não está autenticado!");
        router.replace("/login");
        return;
      }

      const response = await fetch("http://192.168.1.116:8000/api/temas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({
          nome: nome,
          video: videoId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Se a API retornar uma mensagem de erro estruturada
        if (data && typeof data === 'object') {
          // Pega a primeira mensagem de erro se for um objeto com erros
          if (data.nome && Array.isArray(data.nome)) {
            throw new Error(data.nome[0]);
          } else if (data.detail) {
            throw new Error(data.detail);
          } else if (data.message) {
            throw new Error(data.message);
          } else {
            throw new Error('Erro ao cadastrar tema');
          }
        } else {
          throw new Error('Erro ao cadastrar tema');
        }
      }

      alert("Tema cadastrado com sucesso!");
      router.back();

    } catch (error) {
      let errorMessage = "Erro desconhecido";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      alert("Erro ao cadastrar: " + errorMessage);
      console.error("Erro detalhado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Tema</Text>

      <TextInput
        placeholder="Nome do tema"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <Button 
        title={loading ? "Salvando..." : "Salvar tema"} 
        onPress={salvarTema}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
    justifyContent: "center"
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8
  }
});