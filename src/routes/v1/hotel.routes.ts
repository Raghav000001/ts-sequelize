import Router from "express";
import {
  createHotelHandler,
  deleteHotelByIdHandler,
  getAllHotelsHandler,
  getDeletedHotelsHandler,
  getHotelByIdHandler,
  softDeleteHotelByIdHandler,
  updateHotelByIdHandler,
} from "../../controllers/hotel.controller.ts";
import { validate } from "../../middlewares/zod.middleware.ts";
import { createHotelValidatorSchema } from "../../validators/validator.ts";

const hotelRouter = Router();

hotelRouter
  .route("/create")
  .post(validate(createHotelValidatorSchema), createHotelHandler);
hotelRouter.route("/all-hotels").get(getAllHotelsHandler);
hotelRouter.route("/deleted-hotels").get(getDeletedHotelsHandler);
hotelRouter.route("/:id").get(getHotelByIdHandler);
hotelRouter.route("/:id").delete(deleteHotelByIdHandler);
hotelRouter.route("/:id").put(updateHotelByIdHandler);
hotelRouter.route("/soft-delete/:id").delete(softDeleteHotelByIdHandler);

export default hotelRouter;
