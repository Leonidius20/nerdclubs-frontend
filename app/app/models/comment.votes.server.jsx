import { postWithAuthorization } from "./utils.server";

export async function createVoteForComment(request, comment_id, is_positive) {
    return await postWithAuthorization(request, `comment-votes`,
        { comment_id, is_positive });
}