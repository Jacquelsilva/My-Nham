import * as SQLite from "expo-sqlite";


type Recipe = {
  id: string;
  title: string;
  description?: string;
  img?: string;
  ingredients?: string;
  prepareMode?: string;
};

const db = SQLite.openDatabaseSync("receitas.db");


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

type ReceitaRow = {
  id: number;
  title: string;
  description: string;
  img: string;
  ingredients: string;
  prepareMode: string;
  criado_em: string;
};

// Retorna todas as receitas, já no formato do tipo Recipe (id como string)
export function getReceitas(): Recipe[] {
  const rows = db.getAllSync<ReceitaRow>(
    "SELECT * FROM receitas ORDER BY criado_em DESC;"
  );
  return rows.map((r) => ({
    id: String(r.id),
    title: r.title,
    description: r.description,
    img: r.img,
    ingredients: r.ingredients,
    prepareMode: r.prepareMode,
  }));
}

// Insere uma nova receita e retorna o id gerado (como string)
export function addReceita(
  receita: Omit<Recipe, "id">
): string {
  const result = db.runSync(
    `INSERT INTO receitas (title, description, img, ingredients, prepareMode)
     VALUES (?, ?, ?, ?, ?);`,
    [
      receita.title,
      receita.description ?? "",
      receita.img ?? "",
      receita.ingredients ?? "",
      receita.prepareMode ?? "",
    ]
  );
  return String(result.lastInsertRowId);
}

// Remove uma receita pelo id
export function deleteReceita(id: string) {
  db.runSync("DELETE FROM receitas WHERE id = ?;", [Number(id)]);
}