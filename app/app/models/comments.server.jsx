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

export async function getCommentsForPostWithUser(request, post_id) {
    return await fetch(
        `${process.env.BACKEND_URL}/comments/${post_id}/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + await getToken(request),
            },
        }).then((res) => res.json());
}

export async function createComment(request, post_id, content, parent_comment_id) {
    const body = {
        post_id,
        content,
    }

    if (parent_comment_id) {
        body.parent_comment_id = parent_comment_id;
    }

    return await fetch(
        `${process.env.BACKEND_URL}/comments/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + await getToken(request),
            },
            body: JSON.stringify(body),
        }).then((res) => res.json());
}