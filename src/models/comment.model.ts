import prisma from "../config/db.js";

export async function createComment(content:string, postId: string, authorId:string) {
    const newCmt = await prisma.comment.create({
        data:{content,postId,authorId},
        include: {author:true}
    })
    return newCmt
}

export async function getCmt(postId:string) {
    const allCmt = await prisma.comment.findMany({
        where:{postId},
        include: {
            author:true
        }
    })
    return allCmt
}

export async function findCmtById(id:string) {
    const cmt = await prisma.comment.findUnique({
        where:{id}
    })
    return cmt
}

export async function update(id:string,content:string) {
    const updatedComment = await prisma.comment.update({
        where:{id},
        data:{content}
    })
    return updatedComment
};

export async function deleteCmt(id:string) {
    const deletedComment = await prisma.comment.delete({
        where:{id},
    })
    return deletedComment
}