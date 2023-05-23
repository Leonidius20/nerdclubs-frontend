import { getToken } from "../cookies";

export async function postWithAuthorization(request, url, jsonBody) {
    const fullUrl = `${process.env.BACKEND_URL}/${url}`;
    const options = {
        method: "POST",
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
    const fullUrl = `${process.env.BACKEND_URL}/${url}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    return await fetch(fullUrl, options)
        .then((res) => res.json());
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

