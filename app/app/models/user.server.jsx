import { get } from "./utils.server";

export async function getUserDataByToken(token) {
    return await fetch(
        `${process.env.BACKEND_URL}/account`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        }).then((res) => res.json());
}

export async function getUserById(id) {
    return await get(`users/${id}`);
}

export async function getUserByUsername(username) {
    return await get(`users?username=${username}`);
}