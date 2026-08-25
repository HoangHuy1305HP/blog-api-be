import type { NextFunction, Request, Response } from "express";
import { findUserById, updateUserById,deleteUserById } from "../models/user.model.js";

export async function profile(req:Request, res:Response,next:NextFunction) {
    try {
        const id = (req as any).userId;
        const user = await findUserById(id)
    
        if(!user) {
            return res.status(404).json({message:` Không tìm thấy người dùng `})
        }
        return res.status(200).json({message:` Tìm thấy người dùng `,user})
    } catch (error) {
        next(error)
    }
    
}

export async function updateProfile(req:Request, res:Response,next:NextFunction)  {
    try {
        const id = (req as any).userId;
        const {name,bio} = req.body;
        
        const user = await updateUserById(id,name,bio)
        
        return res.status(200).json({message: ` Cập nhật thành công `,user})
    } catch (error) {
        next(error)
    }
    
}

export async function deleteProfile(req:Request, res:Response,next:NextFunction) {
    try {
        const id = (req as any).userId;
        const result = await deleteUserById(id);
        return res.sendStatus(204)
    } catch (error) {
        next(error)
    }
    
}

export async function usersProfile(req:Request, res:Response, next:NextFunction) {
    try {
        const id = req.params.id as string;
        const user = await findUserById(id);
        if(!user) {
            return res.status(404).json({message:` Không tìm thấy người dùng `})
        }
        return res.status(200).json({message:` Tìm thấy người dùng `,user})
    } catch (error) {
        next(error)
    }
}