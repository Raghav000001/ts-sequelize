import { createHotel , deleteHotelById, getAllHotels , getHotelById, updateHotelById , softDeleteHotelById, getDeletedHotels } from "../repositories/hotel.repository.ts";
import { type createHotelDto } from "../dto/hotel.dto.ts";


export async function createHotelService(hotelData: createHotelDto) {
    const createdHotel = await createHotel(hotelData)
    return createdHotel;
}


export async function getAllHotelsService() {
    const hotels = await getAllHotels()
    return hotels;
}

export async function getDeletedHotelsService() {
    const hotels = await getDeletedHotels()
    return hotels;
}


export async function getHotelByIdService(id:number) {
    const hotel = await getHotelById(id)
    return hotel;
}


export async function deleteHotelByIdService(id:number) {
    const response = await deleteHotelById(id)
    return response
}

export async function softDeleteHotelByIdService(id:number) {
    const response = await softDeleteHotelById(id)
    return response
}

export async function updateHotelByIdService(id:number,hotelData:createHotelDto) {
      const updatedHotel = await updateHotelById(id,hotelData)
      return updatedHotel;
}

