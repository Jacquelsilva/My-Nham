import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  Modal,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Recipe } from "../types/recipe";
import { HomeScreenProps } from "../types/navigation";

let receitasArmazenadas: Recipe[] = [];

function initDatabase(): void {
  
}

function getReceitas(): Recipe[] {
  return [...receitasArmazenadas];
}

function addReceita(receita: Omit<Recipe, "id">): void {
  receitasArmazenadas = [
    ...receitasArmazenadas,
    { ...receita, id: String(Date.now()) },
  ];
}

function deleteReceita(id: string): void {
  receitasArmazenadas = receitasArmazenadas.filter(
    (receita) => receita.id !== id,
  );
}

export default function Home({ navigation }: HomeScreenProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);


  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImg, setNewImg] = useState("");
  const [newIngredients, setNewIngredients] = useState("");
  const [newPrepareMode, setNewPrepareMode] = useState("");


  useEffect(() => {
    try {
      initDatabase();
      carregarReceitas();
    } catch (error) {
      console.error("Erro ao iniciar o banco de dados:", error);
      Alert.alert("Erro", "Não foi possível abrir o banco de receitas.");
      setIsLoading(false);
    }
  }, []);

  
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", carregarReceitas);
    return unsubscribe;
  }, [navigation]);

  const carregarReceitas = useCallback(() => {
    try {
      setRecipes(getReceitas());
    } catch (error) {
      console.error("Erro ao carregar receitas:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchText.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchText.toLowerCase()),
  );

  function handleOpenRecipe(recipe: Recipe) {
    navigation.navigate("RecipeProduct", { recipe });
  }

  function handleAddRecipe() {
    if (!newTitle.trim()) {
      Alert.alert("Atenção", "Por favor, informe ao menos o título da receita.");
      return;
    }

    try {
      addReceita({
        title: newTitle.trim(),
        description: newDescription.trim(),
        img: newImg.trim() || "https://via.placeholder.com/150",
        ingredients: newIngredients.trim(),
        prepareMode: newPrepareMode.trim(),
      });

      carregarReceitas(); // busca de novo do banco pra refletir a receita nova

      // Limpa o formulário e fecha o modal
      setNewTitle("");
      setNewDescription("");
      setNewImg("");
      setNewIngredients("");
      setNewPrepareMode("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      Alert.alert("Erro", "Não foi possível salvar a receita.");
    }
  }

  function handleDeleteRecipe(id: string) {
    Alert.alert("Excluir receita", "Tem certeza que deseja excluir esta receita?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          try {
            deleteReceita(id);
            carregarReceitas();
          } catch (error) {
            console.error("Erro ao excluir receita:", error);
            Alert.alert("Erro", "Não foi possível excluir a receita.");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header: Busca + Botão ADD (Conforme wireframe) */}
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
        </View>
        <Button
          title="ADD"
          variant="primary"
          onPress={() => setIsModalVisible(true)}
          style={styles.addButton}
        />
      </View>

      {/* Lista de Receitas */}
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#666" />
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.recipeCard}
              onPress={() => handleOpenRecipe(item)}
              onLongPress={() => handleDeleteRecipe(item.id)}
            >
              <Image source={{ uri: item.img }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
            </Pressable>
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma receita encontrada.</Text>
            </View>
          }
        />
      )}

      {/* Modal de Cadastro de Receita */}
      <Modal visible={isModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Receita</Text>

            <Input
              placeholder="Título da receita"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <Input
              placeholder="Descrição curta"
              value={newDescription}
              onChangeText={setNewDescription}
            />
            <Input
              placeholder="URL da Imagem (opcional)"
              value={newImg}
              onChangeText={setNewImg}
            />
            <Input
              placeholder="Ingredientes (um por linha)"
              value={newIngredients}
              onChangeText={setNewIngredients}
              multiline={true}
              numberOfLines={4}
              style={styles.textArea}
            />
            <Input
              placeholder="Modo de Fazer"
              value={newPrepareMode}
              onChangeText={setNewPrepareMode}
              multiline={true}
              numberOfLines={4}
              style={styles.textArea}
            />

            <View style={styles.modalActions}>
              <Button
                title="Salvar Receita"
                variant="primary"
                onPress={handleAddRecipe}
              />
              <Button
                title="Cancelar"
                variant="secondary"
                onPress={() => setIsModalVisible(false)}
                style={styles.cancelButton}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  inputContainer: {
    flex: 1,
  },
  searchInput: {
    marginBottom: 0,
  },
  addButton: {
    height: 48,
  },
  listContainer: {
    padding: 16,
  },
  recipeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
  },
  recipeImage: {
    width: 96,
    height: 96,
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  recipeDescription: {
    color: "#666",
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: 40,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalActions: {
    marginTop: 10,
    gap: 10,
  },
  cancelButton: {
    marginTop: 5,
  },
});