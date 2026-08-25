import prisma from "../config/db.js";

export async function createUser(data:{email:string, name:string, password:string}){
    const newUser = await prisma.user.create({
        data:{email:data.email, name:data.name, password: data.password},
        // omit:{password : true}
    })
    let {password, ...newUserWithoutPassword} = newUser
    return newUserWithoutPassword
}
export async function findUserByEmail(email:string) {
    const availableUser = await prisma.user.findUnique({
        where:{email}
    })
    return availableUser;
}

export async function updateRefreshToken(id:string, refreshToken: string | null) {
    const newToken = await prisma.user.update({
        where:{id},
        data:{refreshToken}
    })
    return newToken
}

export async function findUserById(id:string) {
    const availableUser = await prisma.user.findUnique({
        where:{id}
    })
    return availableUser;
}
