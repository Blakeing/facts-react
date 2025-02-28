# Database Structure

This project uses a JSON server with separate database files for different domains.

## Directory Structure

```
db/
├── contracts/
│   └── db.json       # Contracts data
├── property/
│   └── db.json       # Property data
└── README.md         # This file
```

## Contracts Database

The contracts database contains information about contracts, including:

- Pre-need contracts
- At-need contracts
- Contract details
- Customer information
- Payment information

## Property Database

The property database contains information about cemetery properties, including:

- Properties
- Sections
- Lots
- Blocks
- Graves

## Running the Database Server

The database server is started using the custom script in `scripts/start-db.js`. This script:

1. Loads both database files
2. Merges them into a single database object
3. Starts a JSON server on port 3001

To start the server, run:

```bash
pnpm run server:multi
```

Or, to start both the development server and the database server:

```bash
pnpm run dev
```

## API Configuration

The database paths are configured in `src/config/db.ts`. This file contains:

- Base URL for the JSON server
- Path to the contracts database
- Path to the property database

This configuration is used by the API modules to access the correct data. 