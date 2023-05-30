import { get, postWithAuthorization } from "./utils.server";

export async function getPostsInCategory(category_id) {
    return await get(`posts?category_id=${category_id}`);
}

export async function createPost(request, category_id, title, content) {
    return await postWithAuthorization(request, `posts`,
        { category_id, title, content });

}

export async function getPost(post_id) {
    return await get(`posts/${post_id}`);

}