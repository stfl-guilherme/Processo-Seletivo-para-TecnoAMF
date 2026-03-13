import { View, Text, StyleSheet, FlatList, Pressable, Button } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tema, Trecho } from "../types";

export default function VideoScreen() {
  const { videoId, id } = useLocalSearchParams<{ videoId: string; id: string }>();
  const router = useRouter();

  const playerRef = useRef<any>(null);

  const [temas, setTemas] = useState<Tema[]>([]);
  const [trechos, setTrechos] = useState<Trecho[]>([]);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const [temasRes, trechosRes] = await Promise.all([
          fetch("http://192.168.1.116:8000/api/temas/", {
            headers: { Authorization: `Token ${token}` }
          }),
          fetch("http://192.168.1.116:8000/api/trechos/", {
            headers: { Authorization: `Token ${token}` }
          })
        ]);

        if (!temasRes.ok || !trechosRes.ok) {
          throw new Error("Erro ao carregar dados");
        }

        const temasData: Tema[] = await temasRes.json();
        const trechosData: Trecho[] = await trechosRes.json();

        const videoIdNumber = parseInt(id, 10);
        
        setTemas(temasData.filter(t => t.video === videoIdNumber));
        setTrechos(trechosData.filter(t => t.video === videoIdNumber));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar temas e trechos");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  const irParaTempo = (segundos: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(segundos, true);
      setPlaying(true);
    }
  };

  // Função para formatar o tempo em minutos:segundos
  const formatarTempo = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <YoutubePlayer
        ref={playerRef}
        height={220}
        play={playing}
        videoId={videoId}
      />

      <Text style={styles.section}>Temas</Text>
      
      <FlatList
        data={temas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>• {item.nome}</Text>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum tema cadastrado</Text>}
      />

      <Button
        title="Adicionar tema"
        onPress={() => {
          router.push(`/addTema?videoId=${id}`);
        }}
      />

      <Text style={styles.section}>Trechos importantes</Text>

      <FlatList
        data={trechos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.trecho}
            onPress={() => irParaTempo(item.inicio)}
          >
            <View>
              <Text style={styles.trechoTempo}>
                ⏱️ {formatarTempo(item.inicio)} - {formatarTempo(item.fim)}
              </Text>
              <Text style={styles.trechoDescricao}>
                {item.descricao}
              </Text>
              <Text style={styles.trechoDuracao}>
                Duração: {item.fim - item.inicio} segundos
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum trecho cadastrado</Text>}
      />

      <Button
        title="Adicionar trecho"
        onPress={() => {
          router.push(`/addTrecho?videoId=${id}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  section: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10
  },
  item: {
    marginTop: 5,
    fontSize: 16
  },
  trecho: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    marginTop: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b6b"
  },
  trechoTempo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4
  },
  trechoDescricao: {
    fontSize: 16,
    color: "#000",
    marginBottom: 4
  },
  trechoDuracao: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic"
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 14
  }
});