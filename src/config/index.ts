// all the basic configurations like port number, database url, secret key for jwt etc will be stored in this file 

import dotenv from "dotenv"

type Config = {
    // we can add more configuration options types here like database url, secret key for jwt etc
    PORT: number,
}

export interface DBConfig {
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_USER: string;
}


export function loadConfig() {
    dotenv.config()
}

loadConfig()

export const serverConfig : Config = {
   PORT: Number(process.env.PORT) || 3000, 
}

export const db_config: DBConfig = {
  DB_HOST:     process.env.DB_HOST     || 'localhost',
  DB_PORT:     Number(process.env.DB_PORT) || 3306,
  DB_NAME:     process.env.DB_NAME     || 'crud_with_ts_sql',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_USER:     process.env.DB_USER     || 'root',
};




