import jsonServer from "json-server";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync, existsSync } from "node:fs";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create the server
const server = jsonServer.create();

// Get the absolute paths to the database files
const contractsDbPath = join(__dirname, "../db/contracts/db.json");
const propertyDbPath = join(__dirname, "../db/property/db.json");

// Check if the database files exist
if (!existsSync(contractsDbPath)) {
	console.error(`Contracts database file not found: ${contractsDbPath}`);
	process.exit(1);
}

if (!existsSync(propertyDbPath)) {
	console.error(`Property database file not found: ${propertyDbPath}`);
	process.exit(1);
}

// Load the database files
const contractsDb = JSON.parse(readFileSync(contractsDbPath, "utf8"));
const propertyDb = JSON.parse(readFileSync(propertyDbPath, "utf8"));

// Merge the databases
const db = {
	...contractsDb,
	...propertyDb,
};

// Create the router
const router = jsonServer.router(db);

// Set default middlewares (logger, static, cors and no-cache)
server.use(jsonServer.defaults());

// Use the router
server.use(router);

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
	console.log(`JSON Server is running on port ${PORT}`);
	console.log(`Serving contracts data from: ${contractsDbPath}`);
	console.log(`Serving property data from: ${propertyDbPath}`);
});
