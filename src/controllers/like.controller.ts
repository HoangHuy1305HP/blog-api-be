import type { Request,Response, NextFunction } from "express";
import { createLike, deleteLike, findLike } from "../models/like.model.js";

export async function likePost(req:Request, res:Response, next:NextFunction) {
    try {
        const postId = req.params.id as string;
        const userId = (req as any).userId;
        const isLikePost = await findLike(postId,userId);
        if(isLikePost) {
            return res.status(409).json({message:` Bạn đẫ thích bài viết`})
        }
        const result = await createLike(postId,userId)
        return res.status(201).json({message:` Đã thích `})
    } catch (error) {
        next(error)
    }
}

export async function unlikePost(req:Request, res:Response, next:NextFunction) {
    try {
        const postId = req.params.id as string; 
        const userId = (req as any).userId;
        const isLikePost = await findLike(postId, userId);
        if(!isLikePost) {
            return res.status(404).json({message:` Chưa thích bài viết này `})
        }
        const result = await deleteLike(postId,userId);
        return res.status(200).json({ message: `Đã bỏ thích` });
    } catch (error) {
        next(error)
    }
}