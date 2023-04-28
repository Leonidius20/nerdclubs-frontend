
export async function login(username, password) {
    return await fetch(process.env.BACKEND_URL + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",

        },
        body: JSON.stringify({
            username,
            password,
        }),
    }).then((res) => res.json());
}

export async function verity2faOtp(otp, token) {
    return await fetch(process.env.BACKEND_URL + "/login/2fa", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
            otp,
        }),
    }).then((res) => res.json());
}

export async function register(username, password, email) {
    return await fetch(process.env.BACKEND_URL + "/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",

        },
        body: JSON.stringify({
            username,
            password,
            email,
        }),
    }).then((res) => res.json());
}

export async function get2faSecret(token) {
    return await fetch(process.env.BACKEND_URL + "/login/2fa/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
            token,
        }),
    }).then((res) => res.json());
}