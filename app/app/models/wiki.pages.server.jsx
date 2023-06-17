import { deleteWithAuthorization, get, postWithAuthorization, putWithAuthorization } from "./utils.server";

export async function getWikiPageByUrl(community_id, url) {
    return await get(`wiki-pages?community_id=${community_id}&url=${url}`);
}

export async function createWikiPage(request, url, title, content, community_id) {
    return await postWithAuthorization(request, `wiki-pages`, {
        url,
        title,
        content,
        community_id,
    });
}

export async function updateWikiPage(request, wiki_page_id, title, content) {
    return await putWithAuthorization(request, `wiki-pages/`, {
        wiki_page_id,
        title,
        content,
    });
}

export async function getAllWikiPagesInCommunity(community_id) {
    return await get(`wiki-pages/all?community_id=${community_id}`);
}

export async function deleteWikiPage(request, community_id, wiki_page_id) {
    return await deleteWithAuthorization(request, `wiki-pages/`, {
        community_id,
        wiki_page_id,
    });
}