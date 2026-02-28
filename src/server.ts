import { genericErrorHandler } from "./middlewares/error.middleware.ts"
import { attachCorelationId } from "./middlewares/corelation.middleware.ts"
import express from "express"
import { serverConfig } from "./config/index.ts"
import logger from "./config/logger.config.ts"
import Sequelize from "./db/models/sequelize.ts"

const app = express()

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
// add a correlationId to every request 
app.use(attachCorelationId)



// custom routes import
import v1Router from "./routes/v1/index.routes.ts"
import v2Router from "./routes/v2/index.router.ts"

// routes implementation
// api versioning
app.use("/api/v1",v1Router)
app.use("/api/v2",v2Router)



// custome error handler middleware to handle all the errors in the application
app.use(genericErrorHandler)



app.listen(serverConfig.PORT,async ()=> {
      logger.info(`app is running on port ${serverConfig.PORT}`);
      await Sequelize.authenticate();
      logger.info('DB Connection has been established successfully!!!.');     
})