import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export interface CardRecipeProps {
  image: string;
  title: string;
  subTitle: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

// Componente reusável para exibir o card de cada receita na lista
export default function CardRecipe({
  image,
  title,
  subTitle,
  onPress,
  onLongPress,
}: CardRecipeProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subTitle} numberOfLines={2}>
          {subTitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#ddd",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
