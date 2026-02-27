import { db_config } from './index.ts';

const config = {
  username: db_config.DB_USER,
  password: db_config.DB_PASSWORD,
  database: db_config.DB_NAME,
  host:     db_config.DB_HOST,
  port:     db_config.DB_PORT,
  dialect:  'mysql',
};

export default config;