import { getToken } from "../cookies";

export async function createVoteForComment(request, comment_id, is_positive) {
    return await fetch(
        `${process.env.BACKEND_URL}/comment-votes`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + await getToken(request),
            },
            body: JSON.stringify({
                comment_id,
                is_positive
            }),
        }).then((res) => res.json());
}