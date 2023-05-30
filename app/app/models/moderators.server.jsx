// get ?community_url=url

import { deleteWithAuthorization, get, postWithAuthorization } from "./utils.server";

export async function getModeratorsByCommunityUrl(community_url) {
    return await get(`moderators?community_url=${community_url}`);
}

export async function addModerator(request, community_id, user_id) {
    return await postWithAuthorization(request, `moderators`, 
        { community_id, user_id });
}

export async function removeModerator(request, community_id, user_id) {
    return await deleteWithAuthorization(request, `moderators`, 
        { community_id, user_id });
}

export async function makeOwner(request, community_id, user_id) {
    return await postWithAuthorization(request, `moderators/make-owner`, 
        { community_id, user_id });
}