import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Image, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Video } from "@/types";

export default function HomeScreen() {
  const router = useRouter();

  const [videos, setVideos] = useState<Video[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          onPress: async () => {
            await AsyncStorage.removeItem("token");
            router.replace("/login");
          }
        }
      ]
    );
  };

  const getYoutubeId = (url: string): string | null => {
    // Corrigindo a regex para extrair ID do YouTube
    const regExp = /v=([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const filteredVideos = videos.filter((video) =>
    video.titulo.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const carregarVideos = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        
        if (!token) {
          router.replace("/login");
          return;
        }

        const response = await fetch("http://192.168.1.116:8000/api/videos/", {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar vídeos");
        }

        const data: Video[] = await response.json();
        setVideos(data);
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar os vídeos");
      } finally {
        setLoading(false);
      }
    };

    carregarVideos();
  }, []);

  const renderItem = ({ item }: { item: Video }) => {
    const youtubeId = getYoutubeId(item.url_video);
    const thumbnail = youtubeId 
      ? `https://img.youtube.com/vi/${youtubeId}/0.jpg`
      : null;

    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          if (youtubeId) {
            router.push(`/video?videoId=${youtubeId}&id=${item.id}`);
          }
        }}
      >
        {thumbnail && (
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        )}
        <View style={styles.cardText}>
          <Text style={styles.videoTitle}>{item.titulo}</Text>
          <Text style={styles.videoDesc}>{item.descricao}</Text>
          {item.expirado && (
            <Text style={styles.expired}>⚠ Vídeo expirado</Text>
          )}
        </View>
      </Pressable>
    );
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
      <View style={styles.topBar}>
        <Text style={styles.title}>Vídeos</Text>
        <Button title="Sair" onPress={logout} />
      </View>

      <TextInput
        placeholder="Pesquisar vídeos..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredVideos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "bold"
  },
  search: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4
  },
  thumbnail: {
    width: "100%",
    height: 200
  },
  cardText: {
    padding: 15
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5
  },
  videoDesc: {
    color: "#555"
  },
  expired: {
    marginTop: 6,
    color: "red",
    fontWeight: "bold"
  }
});