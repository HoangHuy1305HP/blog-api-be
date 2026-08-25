import prisma from "../config/db.js";
export async function createLike(postId:string, userId:string) {
    const newLike = await prisma.like.create({
        data:{postId,userId}
    })
    return newLike
}

export async function deleteLike(postId:string,userId:string) {
    const deletedPost = await prisma.like.delete({
        where:{postId_userId: {postId,userId}}
    })

    return deletedPost
}

export async function findLike(postId:string,userId:string) {
    const isLiked = await prisma.like.findUnique({
        where:{postId_userId:{postId,userId}}
    })
    return isLiked
}