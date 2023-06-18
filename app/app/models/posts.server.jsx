import { deleteWithAuthorization, get, getWithOptionalAuthorization, postWithAuthorization } from "./utils.server";

export async function getPostsInCategory(category_id, page = 1) {
    return await get(`posts?category_id=${category_id}&page=${page}`);
}

export async function createPost(request, category_id, title, content) {
    return await postWithAuthorization(request, `posts`,
        { category_id, title, content });

}

export async function getPost(post_id) {
    return await get(`posts/${post_id}`);

}

export async function getPostWithAuth(request, post_id) {
    return await getWithOptionalAuthorization(request, `posts/${post_id}`);

}

export async function deletePost(request, post_id) {
    return await deleteWithAuthorization(request, `posts/${post_id}`);
}