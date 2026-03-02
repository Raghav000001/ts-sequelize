import logger from "../config/logger.config.ts";
import Hotel from "../db/models/hotel.ts";
import { type createHotelDto, type updateHotelDto } from "../dto/hotel.dto.ts";
import { badRequest } from "../errors/app.errors.ts";
import { Op } from "sequelize";

export const createHotel = async (hotelData: createHotelDto) => {
  try {
    await Hotel.create({
      name: hotelData.name,
      location: hotelData.location,
      ratings: hotelData.ratings ?? null,
    });
  } catch (error) {
    logger.error("Error while creating hotel", error);
    throw new badRequest("Error while creating hotel");
  }
};

export const getAllHotels = async () => {
  try {
    const hotels = await Hotel.findAll({
      where:{
         deletedAt:null 
      }
    });
    return hotels;
  } catch (error) {
    logger.error("Error while fetching hotels", error);
    throw new badRequest("Error while fetching hotels");
  }
};

export const getHotelById = async (id: number) => {
  try {
    const hotel = await Hotel.findByPk(id);
    if (!hotel) {
      throw new badRequest("Hotel not found");
    }
    return hotel;
  } catch (error) {
    logger.error("Error while fetching hotel", error);
    throw new badRequest("Error while fetching hotel");
  }
};

// delete hotel by id
export async function deleteHotelById(id: number) {
  const hotel = await Hotel.findByPk(id);
  await hotel?.destroy();
  return hotel;
}


// soft  delete hotel 
export async function softDeleteHotelById(id: number) {
  const hotel = await Hotel.findByPk(Number(id));
  if (!hotel) {
     logger.error("hotel not found")
     throw new badRequest("Hotel not found");
  }
   hotel.deletedAt = new Date()
   await hotel.save({validate:false})
   logger.info(`hotel with id:${id} soft deleted successfully`)
   return hotel;
}


// get deleted hotels
export const getDeletedHotels = async () => {
  try {
    const hotels = await Hotel.findAll({
      where:{
         deletedAt:{
            [Op.not]:null
         }
      }
    });
    return hotels;
  } catch (error) {
    logger.error("Error while fetching hotels", error);
    throw new badRequest("Error while fetching hotels");
  }
};



// update hotel by id
export async function updateHotelById(id: number, hotelData: updateHotelDto) {
  try {
    const hotel = await Hotel.findByPk(id);
    if (!hotel) {
      throw new badRequest("Hotel not found");
    }
    await hotel.update(hotelData);
    return hotel;
  } catch (error) {
    if (error instanceof badRequest) throw error;
    logger.error("Error while updating hotel", error);
    throw new badRequest("Error while updating hotel");
  }
}
