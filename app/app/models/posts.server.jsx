import { getToken } from "../cookies";

export async function getPostsInCategory(category_id) {
    return await fetch(
        `${process.env.BACKEND_URL}/posts?category_id=${category_id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());

}

export async function createPost(request, category_id, title, content) {
    return await fetch(
        `${process.env.BACKEND_URL}/posts`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + await getToken(request),
            },
            body: JSON.stringify({
                category_id,
                title,
                content
            }),
        }).then((res) => res.json());

}