import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import CardRecipe from "../components/CardRecipe";
import { Recipe } from "../types/recipe";
import { HomeScreenProps } from "../types/navigation";
import {
  initDatabase,
  getReceitas,
  addReceita,
  deleteReceita,
} from "../database/database";

export default function Home({ navigation }: HomeScreenProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Estados dos campos do formulário no modal
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImg, setNewImg] = useState("");
  const [newIngredients, setNewIngredients] = useState("");
  const [newPrepareMode, setNewPrepareMode] = useState("");

  // Inicializa o banco de dados na montagem do componente
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

  // Recarrega os dados do banco sempre que a tela recebe o foco da navegação
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", carregarReceitas);
    return unsubscribe;
  }, [navigation]);

  // Busca a lista atualizada de receitas do SQLite
  const carregarReceitas = useCallback(() => {
    try {
      const dados = getReceitas();
      setRecipes(dados);
    } catch (error) {
      console.error("Erro ao carregar receitas:", error);
      Alert.alert("Erro", "Não foi possível buscar as receitas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filtro em tempo real baseado no texto digitado no campo de busca
  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (recipe.description &&
        recipe.description.toLowerCase().includes(searchText.toLowerCase())),
  );

  // Redireciona para a tela de detalhes enviando a receita selecionada
  function handleOpenRecipe(recipe: Recipe) {
    navigation.navigate("RecipeProduct", { recipe });
  }

  // Valida o formulário, insere no banco e limpa os campos
  function handleAddRecipe() {
    if (!newTitle.trim()) {
      Alert.alert(
        "Atenção",
        "Por favor, informe ao menos o título da receita.",
      );
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

      carregarReceitas();

      // Reset dos campos e fechamento do modal
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

  // Deleta a receita ao pressionar e segurar o card
  function handleDeleteRecipe(id: number) {
    Alert.alert(
      "Excluir receita",
      "Tem certeza que deseja excluir esta receita?",
      [
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
      ],
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superior de busca e botão de adicionar */}
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

      {/* Lista de receitas ou indicador de carregamento */}
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CardRecipe
              image={item.img || "https://via.placeholder.com/150"}
              title={item.title}
              subTitle={item.description || "Sem descrição"}
              onPress={() => handleOpenRecipe(item)}
              onLongPress={() => handleDeleteRecipe(item.id)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma receita encontrada.</Text>
            </View>
          }
        />
      )}

      {/* Modal de formulário para nova receita */}
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
