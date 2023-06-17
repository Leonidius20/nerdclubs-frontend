import { deleteWithAuthorization, get, getWithAuthorization, postWithAuthorization } from "./utils.server";

export async function getCommentsForPost(post_id) {
    return await get(`comments/${post_id}`);
}

export async function getCommentsForPostWithUser(request, post_id) {
    return await getWithAuthorization(request, `comments/${post_id}`);
}

export async function createComment(request, post_id, content, parent_comment_id) {
    const body = {
        post_id,
        content,
    }

    if (parent_comment_id) {
        body.parent_comment_id = parent_comment_id;
    }

    return await postWithAuthorization(request, `comments`, body);
}

export async function deleteComment(request, comment_id) {
    return await deleteWithAuthorization(request, `comments`, {
        comment_id,
    });
}