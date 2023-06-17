import { deleteWithAuthorization, get, postWithAuthorization } from "./utils.server";

export async function getCategories(communityId) {
    return await get(`categories?community_id=${communityId}`);
}

export async function createCategory(request, community_id, name, description) {
    return await postWithAuthorization(request, `categories`, 
     { community_id, name, description });
}

export async function getCategory(categoryId) {
    return await get(`categories/${categoryId}`);
}

export async function deleteCategory(request, community_id, category_id) {
    return deleteWithAuthorization(request, `categories/`, 
     { community_id, category_id });
}