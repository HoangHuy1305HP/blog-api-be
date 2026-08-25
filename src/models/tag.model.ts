import prisma from "../config/db.js";

export async function createNewTag(name:string) {
    const newTag = await prisma.tag.create({
        data:{name}
    })
    return newTag;
}

export async function findTagByName(name:string) {
    const tag = await prisma.tag.findUnique({
        where:{name}
    })
    return tag;
}

export async function findTagById(id:string) {
    const tag = await prisma.tag.findUnique({
        where:{id}
    })
    return tag
}

export async function getAllTag() {
    const allTags = await prisma.tag.findMany();
    return allTags
}