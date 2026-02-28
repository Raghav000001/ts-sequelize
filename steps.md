# Sequelize + MySQL2 Setup with TypeScript

A step-by-step guide to integrating Sequelize ORM with MySQL2 in a TypeScript + ES Module project.

---

## Prerequisites

- Node.js installed
- A MySQL database running
- A TypeScript project with `"type": "module"` in `package.json`

---

## Step 1 — Install Dependencies

```bash
npm install sequelize mysql2
npm install --save-dev sequelize-cli tsx
```

> `tsx` is required to run `.ts` migration files through the Sequelize CLI.

---

## Step 2 — Configure `.sequelizerc`

Create a `.sequelizerc` file in the root of your project. This file **must use CommonJS syntax** — no `import/export` allowed here regardless of your project setup.

```js
// .sequelizerc
const path = require('path');

module.exports = {
  'config':          path.resolve('./src/config/sequelize.config.cjs'),
  'models-path':     path.resolve('./src/db/models'),
  'seeders-path':    path.resolve('./src/db/seeders'),
  'migrations-path': path.resolve('./src/db/migrations'),
};
```

---

## Step 3 — Initialize Sequelize CLI

```bash
npx sequelize-cli init
```

This generates the folders defined in `.sequelizerc`.

---

## Step 4 — Set Up the Database Config

### `src/config/index.ts`

Your main app config file — used by your app, not by the CLI:

```ts
import dotenv from 'dotenv';
dotenv.config();

export interface DBConfig {
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_USER: string;
}

export const db_config: DBConfig = {
  DB_HOST:     process.env.DB_HOST     || 'localhost',
  DB_PORT:     Number(process.env.DB_PORT) || 3306,
  DB_NAME:     process.env.DB_NAME     || 'crud_with_ts_sql',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_USER:     process.env.DB_USER     || 'root',
};
```

### `src/config/sequelize.config.cjs`

A **separate** config file only for the Sequelize CLI. Must be `.cjs` because the CLI uses CommonJS internally and cannot load ES modules or TypeScript directly.

```js
// src/config/sequelize.config.cjs
require('dotenv').config();

module.exports = {
  username: process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME     || 'crud_with_ts_sql',
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 3306,
  dialect:  'mysql',
};
```

> Both `index.ts` and `sequelize.config.cjs` read from the same `.env` file — so there is no duplication of values, just two consumers of the same source.

---

## Step 5 — Add Migration Scripts to `package.json`

Since we want `.ts` migration files, we use `tsx` to run the CLI instead of `npx sequelize-cli` directly:

```json
"scripts": {
  "dev":              "nodemon src/server.ts",
  "migrate":          "tsx ./node_modules/.bin/sequelize-cli db:migrate",
  "migrate:undo":     "tsx ./node_modules/.bin/sequelize-cli db:migrate:undo",
  "migrate:generate": "tsx ./node_modules/.bin/sequelize-cli migration:generate --name"
}
```

> Always use `npm run migrate` instead of `npx sequelize-cli db:migrate` — otherwise `.ts` files won't be understood by the CLI.

---

## Step 6 — Generate a Migration

```bash
npm run migrate:generate create-hotel-table
```

This creates a new timestamped file inside `src/db/migrations/`.

---

## Step 7 — Write the Migration

Open the generated file and define your table schema. Use `module.exports` (not `export default`) — but you can still use TypeScript types with `import type`:

```ts
// src/db/migrations/20260227082148-create-hotel-table.ts
import type { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('Hotels', {
      id: {
        type: 'INTEGER',
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: 'VARCHAR(255)',
        allowNull: false,
      },
      location: {
        type: 'VARCHAR(255)',
        allowNull: false,
      },
      createdAt: {
        type: 'DATE',
        allowNull: false,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: 'DATE',
        allowNull: false,
        defaultValue: new Date(),
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Hotels');
  },
};
```

---

## Step 8 — Run Migrations

```bash
npm run migrate
```

To undo the last migration:

```bash
npm run migrate:undo
```

---

## Project Structure

```
root/
├── .sequelizerc                        # CLI config (CommonJS, always)
├── .env                                # Environment variables
└── src/
    ├── config/
    │   ├── index.ts                    # App config (used by your app)
    │   └── sequelize.config.cjs        # Sequelize CLI config (used by CLI only)
    └── db/
        ├── models/                     # Sequelize models
        ├── migrations/                 # Migration files (.ts with module.exports)
        └── seeders/                    # Seeder files
```

---

## Environment Variables

Create a `.env` file in your project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=crud_with_ts_sql
DB_USER=root
DB_PASSWORD=password
```

> Add `.env` to your `.gitignore` to avoid exposing credentials.

---

## Why This Setup Works

| File | Format | Reason |
|---|---|---|
| `.sequelizerc` | CommonJS | CLI loads this with `require()` directly |
| `sequelize.config.cjs` | CommonJS | CLI cannot load ES modules or TypeScript |
| `index.ts` | ES Module | Used by your app normally |
| Migration files `.ts` | TS + `module.exports` | `tsx` handles transpilation for CLI |
| App code | ES Module (`import/export`) | `"type": "module"` in package.json |

---

## Common Errors & Fixes

**`module is not defined in ES module scope`**
→ File is being treated as ES module. Rename config file to `.cjs` or use `npm run migrate` instead of `npx sequelize-cli`.

**`require is not defined in ES module scope`**
→ You used `require()` inside a `.js` file. Rename it to `.cjs`.

**`Access denied for user ''@'localhost'`**
→ `.env` not loading. Make sure `require('dotenv').config()` is at the top of `sequelize.config.cjs`.

**`Cannot use import statement in a module`**
→ Migration file is using `export default` — use `module.exports` instead (while keeping `import type` for types).