#!/usr/bin/env ts-node
import { clearDatabase, seedDatabase } from "../lib/seed-data";

async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case "seed":
        await seedDatabase();
        break;
      case "clear":
        await clearDatabase();
        break;
      case "reset":
        await clearDatabase();
        await seedDatabase();
        break;
      default:
        console.log("Uso:");
        console.log("  yarn seed seed   - Generar datos falsos");
        console.log("  yarn seed clear  - Limpiar base de datos");
        console.log("  yarn seed reset  - Limpiar y volver a generar");
        process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
