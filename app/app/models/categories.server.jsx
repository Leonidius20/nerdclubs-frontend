import { getToken } from "../cookies";
import { get } from "./utils.server";

export async function getCategories(communityId) {
    return await fetch(
        `${process.env.BACKEND_URL}/categories?community_id=${communityId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
   //  return await get(`/categories?community_id=${communityId}`);
}

export async function createCategory(request, communityId, name, description) {
    return await fetch(
        `${process.env.BACKEND_URL}/categories`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + await getToken(request),
            },
            body: JSON.stringify({ 
                community_id: communityId,
                name, description 
            }),
        }).then((res) => res.json());
}

export async function getCategory(categoryId) {
    return await fetch(
        `${process.env.BACKEND_URL}/categories/${categoryId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        
}