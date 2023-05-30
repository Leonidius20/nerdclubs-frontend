import { get, getWithAuthorization, postWithAuthorization } from "./utils.server";

export async function getVotesForPost(post_id) {
    return await get(`post-votes/${post_id}`);
}

export async function createVoteForPost(request, post_id, is_positive) {
    return await postWithAuthorization(request, `post-votes`,
        { post_id, is_positive });
        
}

export async function getMyVoteForPost(request, post_id) {
    return await getWithAuthorization(request, `post-votes/${post_id}/my`);
}