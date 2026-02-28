import type { Request , Response } from "express"
import { createHotelService, getAllHotelsService, getHotelByIdService , deleteHotelByIdService, updateHotelByIdService  } from "../service/hotel.service.ts";

export const createHotelHandler = async (req:Request,res:Response) => {
      const {name,location,ratings} = req.body;
    const createdHotel = await createHotelService({
        name,
        location,
        ratings
    });
   return res.status(201).json({
        message:"Hotel created successfully",
        hotel:createdHotel,
        success:true
    })
}

export const getAllHotelsHandler = async (req:Request,res:Response) => {
    const hotels = await getAllHotelsService();
    return res.status(200).json({
        message:"Hotels retrieved successfully",
        hotels,
        success:true
    })
}

export const getHotelByIdHandler = async (req:Request,res:Response) => {
    const {id} = req.params;
    const hotel = await getHotelByIdService(Number(id));
    if(!hotel){
        return res.status(404).json({
            message:"Hotel not found",
            success:false
        })
    }
    return res.status(200).json({
        message:"Hotel retrieved successfully",
        hotel,
        success:true
    })
}


export const deleteHotelByIdHandler = async (req:Request,res:Response) => {
    const {id} = req.params
    await deleteHotelByIdService(Number(id))
    return res.status(200).json({
        message:"hotel deleted successfully",
        success:true
    })
}

export const updateHotelByIdHandler = async (req:Request,res:Response) => {
    const {id} = req.params
    const {name,location,ratings} = req.body;

    const updatedHotel = await updateHotelByIdService(Number(id),{
        name,
        location,
        ratings
    })
    return res.status(200).json({
        message:"hotel updated successfully",
        hotel:updatedHotel,
        success:true
    })
}