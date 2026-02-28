import { Router } from "express";
import pingRouter from "./ping.routes.ts";
import hotelRouter from "./hotel.routes.ts";

const v1Router = Router();

v1Router.use("/ping", pingRouter);
v1Router.use("/hotel",hotelRouter)

export default v1Router;
