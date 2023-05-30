import { getToken } from "../cookies";

export async function postWithAuthorization(request, url, jsonBody) {
    return await performWithAuthorization("POST", request, url, jsonBody);
}

export async function deleteWithAuthorization(request, url, jsonBody) {
    return await performWithAuthorization("DELETE", request, url, jsonBody);
}

export async function getWithAuthorization(request, url) {
    const fullUrl = `${process.env.BACKEND_URL}/${url}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + await getToken(request),
        },
    };

    return await fetch(fullUrl, options)
        .then((res) => res.json());
}

export async function get(url) {
    return await fetch(
        `${process.env.BACKEND_URL}/${url}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).then((res) => res.json());
}

export async function post(url, jsonBody) {
    const fullUrl = `${process.env.BACKEND_URL}/${url}`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    };
    if (jsonBody) {
        options.body = JSON.stringify(jsonBody);
    }

    return await fetch(fullUrl, options)
        .then((res) => res.json());
}

export async function getWithOptionalAuthorization(request, url) {
    const token = await getToken(request);
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers.Authorization = "Bearer " + token;
    }

    const fullUrl = `${process.env.BACKEND_URL}/${url}`;
    const options = {
        method: "GET",
        headers,
    };

    return await fetch(fullUrl, options)
        .then((res) => res.json());
}

async function performWithAuthorization(method, request, url, jsonBody) {
    const fullUrl = `${process.env.BACKEND_URL}/${url}`;
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + await getToken(request),
        },
    };
    if (jsonBody) {
        options.body = JSON.stringify(jsonBody);
    }

    return await fetch(fullUrl, options)
        .then((res) => res.json());
}