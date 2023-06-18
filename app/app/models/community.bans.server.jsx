import { deleteWithAuthorization, getWithAuthorization, postWithAuthorization } from "./utils.server";

export async function getUsersBannedInCommunity(request, communityId, pageNumber = 1) {
    return getWithAuthorization(request, 
        `community-admin/banned?community_id=${communityId}&page=${pageNumber}`);
}

export async function banUserInCommunity(request, communityId, userId) {
    return postWithAuthorization(request, 
        `community-admin/banned`,
        { 
            community_id: communityId,
            user_id: userId,
        } 
    );
}

export async function unbanUserInCommunity(request, communityId, userId) {
    return deleteWithAuthorization(request, 
        `community-admin/banned`,
        { 
            community_id: communityId,
            user_id: userId,
        } 
    );
}