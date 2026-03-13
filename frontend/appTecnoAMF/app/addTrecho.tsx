import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddTrecho() {
  const { videoId } = useLocalSearchParams();
  const router = useRouter();

  const [descricao, setDescricao] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");  // Novo estado para o fim
  const [loading, setLoading] = useState(false);

  const salvarTrecho = async () => {
    // Validações
    if (!descricao.trim()) {
      alert("Por favor, digite uma descrição para o trecho");
      return;
    }

    if (!inicio.trim()) {
      alert("Por favor, digite o tempo inicial");
      return;
    }

    if (!fim.trim()) {
      alert("Por favor, digite o tempo final");
      return;
    }

    const tempoInicio = parseInt(inicio);
    const tempoFim = parseInt(fim);

    if (isNaN(tempoInicio) || tempoInicio < 0) {
      alert("Por favor, digite um tempo inicial válido (número positivo)");
      return;
    }

    if (isNaN(tempoFim) || tempoFim < 0) {
      alert("Por favor, digite um tempo final válido (número positivo)");
      return;
    }

    if (tempoFim <= tempoInicio) {
      alert("O tempo final deve ser maior que o tempo inicial");
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

      const response = await fetch("http://192.168.1.116:8000/api/trechos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({
          descricao: descricao,
          inicio: tempoInicio,
          fim: tempoFim,  // Enviando o campo fim
          video: videoId
        })
      });

      const data = await response.json();
      console.log("Resposta da API:", data);

      if (!response.ok) {
        if (data && typeof data === 'object') {
          // Verifica cada campo que pode ter erro
          if (data.descricao) throw new Error(data.descricao[0]);
          if (data.inicio) throw new Error(data.inicio[0]);
          if (data.fim) throw new Error(data.fim[0]);  // Novo campo
          if (data.detail) throw new Error(data.detail);
          if (data.message) throw new Error(data.message);
        }
        throw new Error('Erro ao cadastrar trecho');
      }

      alert("Trecho cadastrado com sucesso!");
      router.back();

    } catch (error) {
      let errorMessage = "Erro desconhecido";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert("Erro ao cadastrar: " + errorMessage);
      console.error("Erro detalhado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Trecho</Text>

      <TextInput
        placeholder="Descrição do trecho"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />

      <TextInput
        placeholder="Tempo inicial (segundos)"
        style={styles.input}
        value={inicio}
        onChangeText={setInicio}
        keyboardType="numeric"
      />

      {/* Novo campo para tempo final */}
      <TextInput
        placeholder="Tempo final (segundos)"
        style={styles.input}
        value={fim}
        onChangeText={setFim}
        keyboardType="numeric"
      />

      <Button 
        title={loading ? "Salvando..." : "Salvar trecho"} 
        onPress={salvarTrecho}
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