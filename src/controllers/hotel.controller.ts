import type { Request , Response } from "express"
import { createHotelService, getAllHotelsService, getHotelByIdService , deleteHotelByIdService, updateHotelByIdService, softDeleteHotelByIdService, getDeletedHotelsService  } from "../service/hotel.service.ts";
import { StatusCodes } from "http-status-codes";

export const createHotelHandler = async (req:Request,res:Response) => {
      const {name,location,ratings} = req.body;
    const createdHotel = await createHotelService({
        name,
        location,
        ratings
    });
   return res.status(StatusCodes.CREATED).json({
        message:"Hotel created successfully",
        hotel:createdHotel,
        success:true
    })
}

export const getAllHotelsHandler = async (req:Request,res:Response) => {
    const hotels = await getAllHotelsService();
    return res.status(StatusCodes.OK).json({
        message:"Hotels retrieved successfully",
        hotels,
        success:true
    })
}

export const getHotelByIdHandler = async (req:Request,res:Response) => {
    const {id} = req.params;
    const hotel = await getHotelByIdService(Number(id));
    if(!hotel){
        return res.status(StatusCodes.NOT_FOUND).json({
            message:"Hotel not found",
            success:false
        })
    }
    return res.status(StatusCodes.OK).json({
        message:"Hotel retrieved successfully",
        hotel,
        success:true
    })
}


export const deleteHotelByIdHandler = async (req:Request,res:Response) => {
    const {id} = req.params
    await deleteHotelByIdService(Number(id))
    return res.status(StatusCodes.OK).json({
        message:"hotel deleted successfully",
        success:true
    })
}


export const softDeleteHotelByIdHandler = async (req:Request,res:Response) => {
    const {id} = req.params
    await softDeleteHotelByIdService(Number(id))
    return res.status(StatusCodes.OK).json({
        message:`hotel soft deleted successfully, id:${id}`,
        success:true
    })
}


export const getDeletedHotelsHandler = async (req:Request,res:Response) => {
    const hotels = await getDeletedHotelsService();
    return res.status(StatusCodes.OK).json({
        message:"Deleted hotels retrieved successfully",
        hotels,
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
    return res.status(StatusCodes.OK).json({
        message:"hotel updated successfully",
        hotel:updatedHotel,
        success:true
    })
}