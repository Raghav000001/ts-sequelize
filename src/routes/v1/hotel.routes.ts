import Router from "express";
import { createHotelHandler, getAllHotelsHandler, getHotelByIdHandler } from "../../controllers/hotel.controller.ts";
import { validate } from "../../middlewares/zod.middleware.ts";
import { createHotelValidatorSchema } from "../../validators/validator.ts";

const hotelRouter = Router()

hotelRouter.route("/create").post(validate(createHotelValidatorSchema) ,createHotelHandler)
hotelRouter.route("/all-hotels").get(getAllHotelsHandler)
hotelRouter.route("/:id").get(getHotelByIdHandler)

export default hotelRouter


