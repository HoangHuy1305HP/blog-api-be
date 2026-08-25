import type { NextFunction, Request, Response } from "express";
import { createNewPost,findPostBySlug,findAllPost,findPostById,update,deletePost, findPostByUser, findPostBySearch } from "../models/post.model.js";
import { findCategoryById } from "../models/category.model.js";
import { findTagById } from "../models/tag.model.js";
import { findRecentPosts } from "../models/post.model.js";
import { findRecentPostsByUser } from "../models/post.model.js";
import { findLike } from "../models/like.model.js";
import { findUserById } from "../models/auth.model.js";
export async function createPost(req:Request, res:Response,next:NextFunction) {
    try {
        const {title,slug,content,published,categoryId,tagIds,coverImage} = req.body;
        if(!title || !slug || !content || !categoryId || !tagIds) {
            return res.status(400).json({message:` Vui lòng nhập đủ dữ liệu `})
        }
        const isExistSlug = await findPostBySlug(slug);
        if(isExistSlug) {
            return res.status(409).json({message:`Slug đã tồn tại`})
        }
        const isExistCategoryId = await findCategoryById(categoryId);
        if(!isExistCategoryId) {
            return res.status(404).json({message:`Category chưa tồn tại`})
        }
        if(typeof published !== "boolean") {
            return res.status(400).json({message:` Vui lòng gửi dữ liệu phù hợp cho publish`})
        }
        if(!Array.isArray(tagIds)) {
            return res.status(400).json({message:` Vui lòng gửi dữ liệu phù hợp cho các thẻ (có dạng: [{}]`})
        }
        for(let i = 0; i < tagIds.length; i++) {
        const tag = await findTagById(tagIds[i])
        if(!tag) {
            return res.status(400).json({message:` Tag chưa tồn tại `})
        }
        }
        
        const authorId = (req as any).userId;
        const result = await createNewPost(title,slug,content,published,authorId,categoryId,tagIds,coverImage)
        return res.status(201).json({message:` Tạo post thành công `,result})
    } catch (error) {
        next(error)
    }
    

}

export async function getAllPosts(req:Request, res:Response,next:NextFunction) {
    try {
        const page =  (req.query.page as string | undefined) ?? "1";
        const limit = (req.query.limit as string | undefined) ?? "10";
        const search = (req.query.search as string | undefined) ?? "";
        const categoryId = req.query.categoryId as string | undefined;
        const tagId = req.query.tagId as string | undefined;

        const numPage = Number(page);
        const numLimit  = Number(limit);

        const skip = (numPage - 1)* numLimit;

        const result = await findAllPost(skip,numLimit,search,categoryId,tagId);

        return res.status(200).json({message: ` Lấy dữ liệu thành công `,data:result})
    } catch (error) {
        next(error)
    }
    
}

export async function getPostById(req:Request, res:Response,next:NextFunction) {
    try {
        const id = req.params.id as string;
        const userId = (req as any).userId;
        const post = await findPostById(id);
        
        let isLiked = false;
        if(userId) {
            const like = await findLike(id,userId);
            isLiked = !!like;
        }
         return res.status(200).json({ message: `Tìm bài viết thành công`, result: { ...post, isLiked } });
    } catch (error) {
        next(error)
    }
    
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, slug, content, coverImage, published, categoryId, tagIds } = req.body;
        const id = req.params.id as string;
        const post = await findPostById(id);
        const categoryid = post?.categoryId
        const authorId = post?.authorId;
        const userId = (req as any).userId;
        const existingSlug = await findPostBySlug(slug)// bài viết A có slug abc, id=123
        if(!categoryid) {
            return res
        }
        const isExistSlugCategory = await findCategoryById(categoryid);
        if (!post) {
            return res.status(404).json({ message: `Không tìm thấy bài viết` });
        }

        if(userId !== authorId) {
            return res.status(403).json({message:` Bạn không được sửa bài viết `})
        }
        
        if (!title || !slug || !content || !categoryId) {
            return res.status(400).json({ message: `Vui lòng nhập đủ dữ liệu` });
        }
        // ... các check khác giữ nguyên (slug, category, published, tagIds array...)

        if(existingSlug && existingSlug.id !== id) {
                return res.status(409).json({message:`Slug đã tồn tại`})
        }

        if(!isExistSlugCategory) {
            return res.status(404).json({message:`Danh mục chưa tồn tại`})
        }

        if(typeof published !== "boolean") {
            return res.status(400).json({message:` Vui lòng gửi dữ liệu phù hợp cho published `})
        }

        if(!Array.isArray(tagIds)) {
            return res.status(400).json({message:`Vui lòng gửi dữ liệu phù hợp cho các thẻ`})
        }

        for(let i = 0; i < tagIds.length; i++) {
            const tag = await findTagById(tagIds[i]);
            if(!tag) {
                return res.status(400).json({message:`tag không tồn tại`})
            }
        }

        const result = await update(id,title, slug, content, coverImage, published, categoryId, tagIds);
        return res.status(200).json({ message: `Cập nhật dữ liệu thành công`, result });
    } catch (error) {
        next(error);
    }
}

export async function deletePostById(req:Request, res:Response,next:NextFunction) {
    try {
        const postId = req.params.id as string;
        if(!postId) {
            return res.status(404).json({message:` Không tìm thấy bài post `})
        }
        // so sánh
        const post = await findPostById(postId);
        if(!post) {
            return res.status(404).json({ message: `Không tìm thấy bài viết` });
        }
        const authorId = post?.authorId;
        const userId = (req as any).userId;
        if(authorId !== userId) {
            return res.status(403).json({message:` Bạn không có quyển xóa post  `})
        }
        const result = await deletePost(postId);
         return res.status(200).json({message:` Đã xóa bài viết `})
    } catch (error) {
        next(error)
    }
    
}

export async function getRecentPosts(req:Request,res:Response,next:NextFunction) {
    try {
        const posts = await findRecentPosts();
        if(!posts) {
            return res.status(404).json({message:` Không tìm thấy kết quả `})
        }
        return res.status(200).json({message:` Đã tìm thấy bài viết `,posts})
    } catch (error) {
        next(error)
    }
}

export async function getRecentPostsByUser(req:Request,res:Response,next:NextFunction) {
    try {
        const postId = req.params.id as string;
        const post = await findPostById(postId);
        if(post) {
            const posts = await findRecentPostsByUser(post.authorId)
            return res.status(200).json({message:` Tìm thấy bài viết `,posts})
        }
        return res.status(404).json({message:` Bài viết không tồn tại `})
    } catch (error) {
        next(error)
    }
}

export async function getPostsByUser(req:Request, res:Response,next:NextFunction) {
    try {
        const id = req.params.id as string;
        const user = await findUserById(id);
        if(!user) {
            return res.status(404).json({message:` Không tìm thấy người dùng `})
        }
        const posts = await findPostByUser(user.id)
        return res.status(200).json({message:` Tìm thấy bài viết  `,posts})
    } catch (error) {
        next(error)
    }
}

export async function getPostsBySearch(req:Request,res:Response, next:NextFunction) {
    try {
        const page =  Number(req.query.page) || 1;
        const limit = Number(req.query.limit as number | undefined) ?? 10;
        const search = (req.query.search as string | undefined) ?? "";
        const skip = (page - 1) * limit;
        const posts = await findPostBySearch(skip,limit,search);
        if(!posts) {
            return res.status(400).json({message:` Không tìm thấy bài viết `})
        }
        return res.status(200).json({message:` Tìm thấy bài viết `,posts})
    } catch (error) {
        next(error)
    }
}