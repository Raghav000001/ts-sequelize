# Steps to set up the starter template

# 1. Clone the repository
git clone https://github.com/Raghav000001/ts-express-starter-template.git
# (If you want to clone it into a custom folder name:)
# git clone https://github.com/Raghav000001/ts-express-starter-template.git my-awesome-project

# 2. Go into the project folder
cd Express-Typescript-Starter-Project
# (If you used a custom name above, use that instead)
# cd my-awesome-project

# 3. Install all dependencies
npm install
# or shorter version:
# npm i

# 4. Create a .env file and add the PORT variable
# Recommended simple way (creates or overwrites .env):
echo "PORT=3000" > .env

# Alternative (appends if file already exists):
# echo "PORT=3000" >> .env

# 5. Start the development server
npm run dev
# Sequelize + MySQL2 Setup with TypeScript

A step-by-step guide to integrating Sequelize ORM with MySQL2 in a TypeScript project.

---

## Prerequisites

- Node.js installed
- A MySQL database running
- A TypeScript project initialized

---

## Step 1 — Install Dependencies

```bash
npm install sequelize mysql2
npm install --save-dev sequelize-cli
```

---

## Step 2 — Configure `.sequelizerc`

Create a `.sequelizerc` file in the root of your project. This tells the Sequelize CLI where to look for your config, models, seeders, and migrations.

```js
// .sequelizerc
const path = require('path');

module.exports = {
  'config':          path.resolve('./src/config/config.ts'),
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

This generates the folders defined in `.sequelizerc` along with a default `config.json`. Rename it and change its extension to `.ts` (or `.js`).

---

## Step 4 — Set Up the Database Config

### `src/config/index.ts`

Add a typed `db_config` export to your main config file:

```ts
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

### `src/config/config.ts`

Update the Sequelize config file to pull values from your central config:

```ts
import { db_config } from './index';

const config = {
  username: db_config.DB_USER,
  password: db_config.DB_PASSWORD,
  database: db_config.DB_NAME,
  host:     db_config.DB_HOST,
  port:     db_config.DB_PORT,
  dialect:  'mysql',
};

export default config;
```

---

## Step 5 — Generate a Migration

```bash
npx sequelize-cli migration:generate --name create-hotel-table
```

This creates a new timestamped file inside `src/db/migrations/`. Open it and define your table schema using Sequelize's `queryInterface`:

```ts
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('Hotels', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Hotels');
  },
};
```

---

## Step 6 — Run Migrations

```bash
npx sequelize-cli db:migrate
```

To undo the last migration:

```bash
npx sequelize-cli db:migrate:undo
```

---

## Project Structure

```
src/
├── config/
│   ├── index.ts         # Central config & environment variables
│   └── config.ts        # Sequelize DB config
└── db/
    ├── models/          # Sequelize models
    ├── migrations/      # Migration files
    └── seeders/         # Seeder files
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

> **Note:** Add `.env` to your `.gitignore` to avoid exposing credentials and rename the extenion of migration file to .ejs if conflict arises.