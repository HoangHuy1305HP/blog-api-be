import type { NextFunction, Request, Response } from "express";
import { createCategory, findCategoryByName, findAllCategory, findCategoryById, updateCategoryById, deleteCategoryById } from "../models/category.model.js";

export async function category(req:Request, res:Response,next:NextFunction) {
    try {
        const {name} = req.body;
        if(!name) {
            return res.status(400).json({message:` Thiếu dữ liệu `})
        }
        const isExist = await findCategoryByName(name);
        if(isExist) {
            return res.status(209).json({message:` Danh mục đã tồn tại `})
        }
        const newCategory = await createCategory(name);
        return res.status(201).json({message: ` Tạo danh mục mới thành công `,newCategory})
    } catch (error) {
        next(error)
    }
    
}

export async function getAllCategory(req:Request, res:Response,next:NextFunction) {
    try {
         const result = await findAllCategory();
        if(!result) {
            return []
        }
        return res.status(200).json({message: ` Lấy dữ liệu thành công `,result})
    } catch (error) {
        next(error)
    }
   
}

export async function getCategoryById(req:Request, res:Response,next:NextFunction) {
    try {
        const id = req.params.id as string;
        const result  = await findCategoryById(id);
        if(!result) {
            return res.status(404).json({message: ` Category không tồn tại `})
        }
        return res.status(200).json({message:` Tìm thấy category `,result})
    } catch (error) {
        next(error)
    }
    
}

export async function updateCategory(req:Request, res:Response,next:NextFunction) {
    try {
        const id = req.params.id as string;
        const {name} = await req.body;
        const existCategory = await findCategoryByName(name);
        if(existCategory) {
            return res.status(409).json({message:` Tên danh mục đã tồn tại `,existCategory})
        }
        const result = await updateCategoryById(id,name);
        return res.status(200).json({message: ` Cập nhật danh mục thành công `,result})
    } catch (error) {
        next(error)
    }
    
}

export async function deleteCategory(req:Request, res:Response,next:NextFunction) {
    try {
         const id = req.params.id as string;
        const result =  await deleteCategoryById(id);
        return res.sendStatus(204)
    } catch (error) {
        next(error)
    }
   
}