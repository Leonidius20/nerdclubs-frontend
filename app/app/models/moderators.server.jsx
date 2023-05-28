// get ?community_url=url

import { get, postWithAuthorization } from "./utils.server";

export async function getModeratorsByCommunityUrl(community_url) {
    return await get(`moderators?community_url=${community_url}`);
}

export async function addModerator(request, community_id, user_id) {
    return await postWithAuthorization(request, `moderators`, 
        { community_id, user_id });
}