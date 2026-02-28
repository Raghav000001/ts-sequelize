import Router from "express";
import { createHotelHandler, deleteHotelByIdHandler, getAllHotelsHandler, getHotelByIdHandler, updateHotelByIdHandler } from "../../controllers/hotel.controller.ts";
import { validate } from "../../middlewares/zod.middleware.ts";
import { createHotelValidatorSchema } from "../../validators/validator.ts";

const hotelRouter = Router()

hotelRouter.route("/create").post(validate(createHotelValidatorSchema) ,createHotelHandler)
hotelRouter.route("/all-hotels").get(getAllHotelsHandler)
hotelRouter.route("/:id").get(getHotelByIdHandler)
hotelRouter.route("/:id").delete(deleteHotelByIdHandler)
hotelRouter.route("/:id").put(updateHotelByIdHandler)


export default hotelRouter


