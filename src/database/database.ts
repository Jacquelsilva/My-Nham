import * as SQLite from "expo-sqlite";
import { Recipe, RecipeAddDTO } from "../types/recipe";

// Inicializa a conexão síncrona com o arquivo do banco de dados
const db = SQLite.openDatabaseSync("receitas.db");

// Cria a tabela de receitas caso ainda não exista no dispositivo
export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS receitas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      img TEXT,
      ingredients TEXT,
      prepareMode TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Retorna todas as receitas gravadas ordenadas pela data de criação
export function getReceitas(): Recipe[] {
  const rows = db.getAllSync<Recipe>(
    'SELECT * FROM receitas ORDER BY criado_em DESC;'
  );
  return rows;
}

// Busca o registro de uma receita específica através do seu ID
export function getReceitaById(id: number): Recipe | null {
  const row = db.getFirstSync<Recipe>(
    "SELECT * FROM receitas WHERE id = ?;",
    [id]
  );

  if (!row) {
    return null;
  }

  return row;
}

// Insere uma nova receita na tabela e retorna o ID gerado
export function addReceita(receita: RecipeAddDTO): number {
  const result = db.runSync(
    `INSERT INTO receitas (title, description, img, ingredients, prepareMode)
     VALUES (?, ?, ?, ?, ?);`,
    [
      receita.title,
      receita.description ?? '',
      receita.img ?? '',
      receita.ingredients ?? '',
      receita.prepareMode ?? '',
    ]
  );
  return result.lastInsertRowId;
}

// Remove o registro da receita correspondente ao ID informado
export function deleteReceita(id: number) {
  db.runSync("DELETE FROM receitas WHERE id = ?;", [id]);
}