import prisma from "../config/db.js";

export async function createCategory(name:string) {
    const newCategory = await prisma.category.create({
        data:{name}
    })
    return newCategory
}

export async function findCategoryByName(name:string) {
    const existCategory = await prisma.category.findUnique({
        where:{name}
    })
    return existCategory;
}

export async function findAllCategory() {
    const categoryList = await prisma.category.findMany({
        orderBy: {
            name: "asc",
        }
    })
    return categoryList;
}

export async function findCategoryById(id:string) {
    const category = await prisma.category.findUnique({
        where:{id}
    })
    return category;
}

export async function updateCategoryById(id:string,name:string) {
    const updateCategory = await prisma.category.update({
        where:{id},
        data:{name}
    })
    return updateCategory;
}

export async function deleteCategoryById(id:string) {
    const deleteCategory = await prisma.category.delete({
        where:{id}
    })
    return deleteCategory;
}