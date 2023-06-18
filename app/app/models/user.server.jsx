import { get, getWithAuthorization, putWithAuthorization } from "./utils.server";

export async function getUserDataByToken(request) {
    return getWithAuthorization(request, `account`);
}

export async function getUserById(id) {
    return get(`users/${id}`);
}

export async function getUserByUsername(username) {
    return get(`users?username=${username}`);
}

export async function getAllBannedUsers(request, page = 1) {
    return getWithAuthorization(request, `users/banned?page=${page}`);
}

export async function banUser(request, userId) {
    return putWithAuthorization(request, `users/${userId}/ban`);
}

export async function unbanUser(request, userId) {
    return putWithAuthorization(request, `users/${userId}/unban`);
}