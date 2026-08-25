import type { NextFunction, Request, Response } from "express";
import { createNewTag,findTagByName,getAllTag } from "../models/tag.model.js";


export async function getTags(req:Request, res:Response,next:NextFunction) {
    try {
        const result = await getAllTag()
        return res.status(200).json({message:` Lấy dữ liệu thành công `,result})
    } catch (error) {
        next(error)
    }
}
export async function createTag(req:Request, res:Response,next:NextFunction) {
    try {
         const {name} = req.body;
        if(!name) {
            return res.status(400).json({message:` Yêu cầu nhập tên `})
        }
        const existTag = await findTagByName(name);
        if(existTag) {
            return res.status(409).json({message:` Thẻ đã tồn tại `})
        }
        const tag = await createNewTag(name)
        return res.status(201).json({message:` Tạo thẻ mới thành công `,tag})
    } catch (error) {
        next(error)
    }
   
}