import { getToken } from "../cookies";


export async function getCommentsForPost(post_id) {
    return await fetch(
        `${process.env.BACKEND_URL}/comments/${post_id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
}

export async function createComment(request, post_id, content, parent_comment_id) {
    return await fetch(
        `${process.env.BACKEND_URL}/comments/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": await getToken(request),
            },
            body: JSON.stringify({
                post_id,
                content,
                parent_comment_id,
            }),
        }).then((res) => res.json());
}