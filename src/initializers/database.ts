import { createConnection } from "typeorm";
import { Card } from "entities/card";

export const databaseInitializer = async () => {
  const connection = await createConnection({
    type: "postgres",
    host: "0.0.0.0",
    port: 5432,
    username: "postgres",
    password: "",
    database: "sample_db",
    entities: [Card],
    logging: ["query", "error"],
    synchronize: true,
  });

  console.log("Database connection established");
};
