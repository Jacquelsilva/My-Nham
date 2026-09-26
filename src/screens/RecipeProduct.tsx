import { View, StyleSheet, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui/Button";
import { RecipeProductScreenProps } from "../types/navigation";
import { deleteReceita } from "../database/database";

export default function RecipeProduct({
  route,
  navigation,
}: RecipeProductScreenProps) {
  // Extrai o objeto da receita passado via parâmetro na navegação
  const { recipe } = route.params;

  // Dispara o alerta de confirmação e executa a exclusão no SQLite
  function handleDelete() {
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
              deleteReceita(recipe.id);
              navigation.goBack(); // Retorna para a tela anterior (Home)
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
      <ScrollView contentContainerStyle={styles.content}>
        {/* Imagem principal da receita */}
        <Image source={{ uri: recipe.img }} style={styles.image} />

        <View style={styles.body}>
          <Text style={styles.title}>{recipe.title}</Text>

          {/* Renderização condicional da descrição */}
          {recipe.description ? (
            <Text style={styles.description}>{recipe.description}</Text>
          ) : null}

          <Text style={styles.sectionTitle}>Ingredientes</Text>
          <Text style={styles.sectionText}>
            {recipe.ingredients || "Nenhum ingrediente informado."}
          </Text>

          <Text style={styles.sectionTitle}>Modo de Preparo</Text>
          <Text style={styles.sectionText}>
            {recipe.prepareMode || "Nenhum modo de preparo informado."}
          </Text>

          {/* Botões de Ação */}
          <View style={styles.actions}>
            <Button
              title="Voltar"
              variant="secondary"
              onPress={() => navigation.goBack()}
            />
            <Button
              title="Excluir Receita"
              variant="primary"
              onPress={handleDelete}
              style={styles.deleteButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingBottom: 24,
  },
  image: {
    width: "100%",
    height: 240,
    backgroundColor: "#eee",
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  actions: {
    marginTop: 24,
    gap: 10,
  },
  deleteButton: {
    backgroundColor: "#d33",
  },
});
