import type { NextFunction, Request, Response } from "express";
import { createComment, getCmt, update, findCmtById,deleteCmt } from "../models/comment.model.js";
import { findPostById } from "../models/post.model.js";

export async function createNewComment(req:Request, res:Response,next:NextFunction) {
    try {
        const {content} = req.body;
        const postId = req.params.postId as string ;
        const post = await findPostById(postId);
        if(!post) {
            return res.status(404).json({message:`Post không tồn tại`})
        }
        if(!content) {
            return res.status(400).json({message: `Vui lòng nhập comment`})
        }
        const authorId = (req as any).userId;
        const newComment = await createComment(content, postId, authorId);
        return res.status(201).json({message: `Comment thành công`, newComment})
    } catch (error) {
        next(error)
    }
    
}

export async function getAllComment(req:Request, res:Response,next:NextFunction) {
    try {
        const postId = req.params.postId as string;
        const post = await findPostById(postId);
        if(!post) {
            return res.status(404).json({message:` Không tìm thấy bài viết `})
        }
        const result = await getCmt(postId);
        return res.status(200).json({message:` Hiển thị bình luận thành công `,result})
    } catch (error) {
        next(error)
    }
}

export async function updateComment(req:Request, res:Response,next:NextFunction) {
    try {
        const postId = req.params.id as string;
        const cmt = await findCmtById(postId)
        if(!cmt) {
            return res.status(404).json({message:` Không tìm thấy bình luận `})
        }
        const authorId = cmt.authorId;
        const userId = (req as any).userId;
        if(authorId !== userId) {
            return res.status(403).json({message: ` Bạn không được cập nhật bình luận `})
        };
        const {content} = req.body
        const result = await update(postId,content);
        return res.status(200).json({message:` Cập nhật Comment thành công `,result})
    } catch (error) {
        next(error)
    }
    
}

export async function deleteComment(req:Request, res:Response,next:NextFunction) {
    try {
         const id = req.params.id as string;
        const comment = await findCmtById(id);
        if(!comment) {
            return res.status(404).json({message:` Không tìm thấy bình luận `})
        }
        const commentUser = comment.authorId;
        const user = (req as any).userId;
        if(commentUser !== user) {
            return res.status(403).json({message:` Bạn không được xóa bình luận `})
        }
        const result = await deleteCmt(id);
        return res.sendStatus(204)
    } catch (error) {
        next(error)
    }
   
}