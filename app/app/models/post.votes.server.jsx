import { getToken } from "../cookies";

export async function getVotesForPost(post_id) {
    return await fetch(
        `${process.env.BACKEND_URL}/post-votes/${post_id}/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());

}

export async function createVoteForPost(request, post_id, is_positive) {
    return await fetch(
        `${process.env.BACKEND_URL}/post-votes`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + await getToken(request),
            },
            body: JSON.stringify({
                post_id,
                is_positive
            }),
        }).then((res) => res.json());
        
}

export async function getMyVoteForPost(request, post_id) {
    return await fetch(
        `${process.env.BACKEND_URL}/post-votes/${post_id}/my`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + await getToken(request),
            },
        }).then((res) => res.json());

}