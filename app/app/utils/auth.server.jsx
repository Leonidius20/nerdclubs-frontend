
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

export async function verify2faEnabling(token, code) {
    return await fetch(process.env.BACKEND_URL + "/login/2fa/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                otp: code,
                }),
            }).then((res) => res.json());
}

/**
 * Check if user's JWT token is valid (has correct signature)
 * @param {string} token
 * @returns {Promise<{valid: boolean}>}
 */
export async function verifyToken(token) {
    return await fetch(process.env.BACKEND_URL + "/verifytoken", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
        },
    }).then((res) => res.json());
}
