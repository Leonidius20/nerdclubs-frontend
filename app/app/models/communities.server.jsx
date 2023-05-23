import { getWithOptionalAuthorization } from "./utils.server";
import { get, postWithAuthorization } from "./utils.server";

// load communities from server
export async function getCommunities(query, page) {
    let baseUrl = `${process.env.BACKEND_URL}/communities`;
    if (query || page) baseUrl += "?";
    if (query) baseUrl += `query=${query}`;
    if (query && page) baseUrl += "&";
    if (page) baseUrl += `page=${page}`;

    return await fetch(
        baseUrl,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
}

// create a community with name, description, and url
export async function createCommunity(request, name, description, url) {
    return await postWithAuthorization(request, "communities", {
        name,
        description,
        url,
    });
}

export async function searchCommunities(query) {
    return await get(`communities/?query=${query}`);
}

export async function getCommunity(request, url) {
    return await getWithOptionalAuthorization(request, `communities/${url}`);
}