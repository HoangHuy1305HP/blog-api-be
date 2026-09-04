import prisma from "../config/db.js";

export async function createNewPost(title:string, slug:string,content:string,published:boolean, authorId:string, categoryId:string, tagIds:string[],coverImage:string) {
    const newPost = await prisma.post.create({
        data:{title,
              slug,
              content,
              published,
              authorId,
              categoryId,
              tags: {
                connect: tagIds.map(id => ({
                    id
                }))
              },
              coverImage
        },
        
        include: {
                author: { select: { id: true, name: true } },
                category: { select: { id: true, name: true } },
                _count: { select: { comments: true } },
                },
        
    })
    return newPost
}

export async function findPostBySlug(slug:string) {
    const slugPost = await prisma.post.findUnique({
        where:{slug}
    })
    return slugPost;
}

export async function findAllPost(skip:number, take:number, search:string,categoryId?:string,tagId?:string,published?:boolean) {
    const where:any = {
        categoryId,
        published:true,
        OR: [{title:{contains:search}},
            {content:{contains:search}}
        ]
    };

    if(tagId) {
        where.tags = {
            some: {
                id: tagId
            }
        }
    }
    const allPost = await prisma.post.findMany({
        orderBy: {createdAt: "desc"},
        where,
        skip:skip,
        take:take,
        include: {
            author: {
                select:{
                    id:true,
                    name:true
                }
            },
            category: {
                select: {
                    id:true,
                    name:true
                }
            },
            _count: {
                select: {
                    comments:true,
                    like:true
                }
            }
        }
    });
    return allPost
}

export async function findPostById(id:string) {
    const post = await prisma.post.findFirst({
        where:{id},
        include: {
            author: {select:{id:true,name:true,bio:true}},
            category: {select:{id:true,name:true}},
            _count: {select:{comments:true, like:true}},
            tags:{select:{id:true,name:true}}
        }
    })
    return post
}

export async function update(id:string,title:string, slug:string,content:string,coverImage:string,published:boolean,categoryId:string, tagIds:string[]) {
    const updatedPost = await prisma.post.update({
        where:{id},
        data:{
            title,
            slug,
            content,
            coverImage,
            published,
            categoryId,
            tags:{
                set: tagIds.map(t => ({id: t}))
            }
        }
    })
    return updatedPost
}

export async function deletePost(id:string) {
    const post = await prisma.post.delete({
        where:{id}
    })
    return post
}

export async function findRecentPosts() {
    const recentPost = await prisma.post.findMany({
        where:{published:true},
        take:5,
        orderBy:{createdAt:"desc"},
        include: {
            author:{select: {id:true, name:true}},
            category:{select:{id:true,name:true}},
            _count:{select: {comments:true,like:true}}
        }
    })
    return recentPost;
}

export async function findRecentPostsByUser(authorId:string) {
    const recentPosts = await prisma.post.findMany({
        where:{authorId,published:true},
        orderBy:{createdAt:"desc"},
        take:5,
        include:{
            tags:{select:{id:true,name:true}}
        }
    })

    return recentPosts;
}

export async function findPostByUser(authorId:string) {
    const posts = await prisma.post.findMany({
        where:{authorId},
        orderBy:{createdAt:"desc"},
        include: {
            tags:{select:{id:true,name:true}},
            author:{select:{id:true,name:true}},
            _count: {select:{like:true}}
        }
    })
    return posts;
}


export async function findPostBySearch(skip:number,take:number,search:string) {
    const posts = await prisma.post.findMany({
        where: {
            OR: [
                {title: {contains:search}},
                {content:{contains:search}}
            ]
        },
        skip:skip,
        take:take,
        include: {
            author: {
                select: {id:true,name:true}
            },
            category:{
                select:{id:true,name:true}
            },
            _count:{
                select:{comments:true,like:true}
            }
        },
        orderBy: {createdAt:"desc"}
    })
    const total = await prisma.post.count({
        where: {
            OR: [
                {title:{contains:search}},
                {content:{contains:search}}
            ]
        }
    });
    return {posts,total}
}