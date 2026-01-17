import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não está definida no arquivo .env");
}

// Configuração de conexão com timeout e retry
const connectionString = process.env.DATABASE_URL;

const sql = postgres(connectionString, {
  ssl: "require",
  max: 10, // número máximo de conexões
  idle_timeout: 20, // timeout de conexões ociosas
  connect_timeout: 10, // timeout de conexão (10 segundos)
  prepare: false, // desabilita prepared statements (necessário para pooling)
});

export const db = drizzle(sql, { schema });
export const pg = sql;

// Função para testar a conexão
export async function testConnection() {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    throw new Error("Erro ao conectar ao banco de dados", {
      cause: error,
    });
  }
}
