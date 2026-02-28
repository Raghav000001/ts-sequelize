import logger from "../config/logger.config.ts";
import Hotel from "../db/models/hotel.ts";
import { type createHotelDto } from "../dto/hotel.dto.ts";
import { badRequest } from "../errors/app.errors.ts";


export const createHotel = async (hotelData:createHotelDto) => {
      try {
        await Hotel.create({
            name:hotelData.name,
            location:hotelData.location,
            ratings:hotelData.ratings ?? null,
        })
      } catch (error) {
            logger.error("Error while creating hotel",error);
            throw new badRequest("Error while creating hotel")
      }
    
}


export const getAllHotels = async () => {
    try {
        const hotels = await Hotel.findAll();
        return hotels;
    } catch (error) {
        logger.error("Error while fetching hotels",error);
        throw new badRequest("Error while fetching hotels")
    }
}

export const getHotelById = async (id:number) => {
    try {
        const hotel = await Hotel.findByPk(id);
        if(!hotel){
            throw new badRequest("Hotel not found")
        }
        return hotel;
    } catch (error) {
        logger.error("Error while fetching hotel",error);
        throw new badRequest("Error while fetching hotel")
    }
}