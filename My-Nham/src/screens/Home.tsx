import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  Modal,
  ScrollView,
} from "react-native";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import CardRecipe from "../components/ui/CardRecipe";
import { MOCK_RECIPES } from "../data/mockRecipes";
import { Recipe } from "../types/recipe";
import { HomeScreenProps } from "../types/navigation";

export default function Home({ navigation }: HomeScreenProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Estados do formulário de nova receita
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImg, setNewImg] = useState("");
  const [newIngredients, setNewIngredients] = useState("");
  const [newPrepareMode, setNewPrepareMode] = useState("");

  // Filtra as receitas em tempo real com base no texto de busca
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
      alert("Por favor, informe ao menos o título da receita.");
      return;
    }

    const newRecipe: Recipe = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      img: newImg || "https://via.placeholder.com/150",
      ingredients: newIngredients,
      prepareMode: newPrepareMode,
    };

    setRecipes([newRecipe, ...recipes]);

    // Limpa o formulário e fecha o modal
    setNewTitle("");
    setNewDescription("");
    setNewImg("");
    setNewIngredients("");
    setNewPrepareMode("");
    setIsModalVisible(false);
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
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardRecipe
            image={item.img}
            title={item.title}
            subTitle={item.description}
            onPress={() => handleOpenRecipe(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma receita encontrada.</Text>
          </View>
        }
      />

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
  emptyContainer: {
    alignItems: "center",
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
