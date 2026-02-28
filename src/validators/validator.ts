import {z} from "zod";

export const userValidatorSchema =  z.object({
     email :z.string().trim().toLowerCase().email("invalid email address"),
     password:z.string().trim().min(5, "password must be at least 5 characters").max(20, "pass can not be bigger than 20 characters")
})


export const createHotelValidatorSchema = z.object({
    name:z.string().trim().min(3,"name must be at least 3 characters").max(50,"name can not be bigger than 50 characters"),
    location:z.string().trim().min(3,"location must be at least 3 characters").max(50,"location can not be bigger than 50 characters"),
    ratings:z.number().min(0,"ratings can not be less than 0").max(5,"ratings can not be greater than 5")
})