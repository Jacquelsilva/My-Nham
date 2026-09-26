// 1. Entidade principal usada nas telas React Native
export interface Recipe {
  id: number;
  title: string;
  description?: string;
  img?: string;
  ingredients?: string;
  prepareMode?: string;
  criado_em?: string;
}

// 2. DTO derivado automaticamente (Remove id e criado_em)
export type RecipeAddDTO = Omit<Recipe, "id" | "criado_em">;