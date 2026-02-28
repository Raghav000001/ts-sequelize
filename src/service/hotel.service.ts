import Hotel from "../db/models/hotel.ts";
import { createHotel } from "../repositories/hotel.repository.ts";
import { type createHotelDto } from "../dto/hotel.dto.ts";


export async function createHotelService(hotelData: createHotelDto) {
    const createdHotel = await createHotel(hotelData)
    return createdHotel;
}


export async function getAllHotelsService() {
    const hotels = await Hotel.findAll();
    return hotels;
}

export async function getHotelByIdService(id:number) {
    const hotel = await Hotel.findByPk(id);
    return hotel;
}