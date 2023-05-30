import { get, getWithAuthorization } from "./utils.server";

export async function getUserDataByToken(request) {
    return await getWithAuthorization(request, `account`);
}

export async function getUserById(id) {
    return await get(`users/${id}`);
}

export async function getUserByUsername(username) {
    return await get(`users?username=${username}`);
}