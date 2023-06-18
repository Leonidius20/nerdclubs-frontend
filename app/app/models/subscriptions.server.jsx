import { deleteWithAuthorization, getWithAuthorization, postWithAuthorization } from "./utils.server";

export async function subscribeToCommunity(request, community_id) {
    return await postWithAuthorization(request, `subscriptions`,
        { community_id });
}

export async function unsubscribeFromCommunity(request, community_id) {
    return await deleteWithAuthorization(request, `subscriptions`,
        { community_id });
}

export async function getPostsFromSubscriptions(request, page = 1) {
    return await getWithAuthorization(request, `subscriptions/posts?page=${page}`);
}