import prisma from "../config/db.js";

export async function findUserById(id:string) {
    const user = prisma.user.findUnique({
        where:{id},
        select: {
            id:true,
            // email:true,
            name:true,
            bio:true,
            createdAt:true,
            updatedAt:true
        }
    })
    return user
}

export async function updateUserById(id:string, name:string,bio:string) {
    const user = await prisma.user.update({
        where:{id},
        data: {
            name,
            bio
        }
    })
    return user
}

export async function deleteUserById(id:string) {
    const deletedUser = prisma.user.delete({
        where:{id}
    })
    return deletedUser
}