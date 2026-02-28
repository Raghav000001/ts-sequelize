import { Sequelize } from "sequelize";
import { db_config } from "../../config/index.ts";


const sequelize = new Sequelize({
    dialect: "mysql",
    host: db_config.DB_HOST,
    port: db_config.DB_PORT,
    username: db_config.DB_USER,
    password: db_config.DB_PASSWORD,
    database: db_config.DB_NAME,
})

export default sequelize;