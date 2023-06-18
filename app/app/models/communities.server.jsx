import { deleteWithAuthorization, getWithOptionalAuthorization } from "./utils.server";
import { get, postWithAuthorization } from "./utils.server";

// load communities from server
export async function getCommunities(query, page) {
    let baseUrl = `communities`;
    if (query || page) baseUrl += "?";
    if (query) baseUrl += `query=${query}`;
    if (query && page) baseUrl += "&";
    if (page) baseUrl += `page=${page}`;

    return get(baseUrl);
}

// create a community with name, description, and url
export async function createCommunity(request, name, description, url) {
    return postWithAuthorization(request, "communities", {
        name,
        description,
        url,
    });
}

export async function searchCommunities(query) {
    return get(`communities/?query=${query}`);
}

export async function getCommunity(request, url) {
    return getWithOptionalAuthorization(request, `communities/${url}`);
}

export async function deleteCommunity(request, community_id) {
    return deleteWithAuthorization(request, `communities`, {
        community_id,
    });
}

export async function getNumberOfCommunities() {
    return get(`community-count`);
}