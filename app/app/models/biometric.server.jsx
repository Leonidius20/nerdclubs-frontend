// this file is for getting challenges from the server

export async function getRegistrationChallenge(token) {
    return await fetch(
        `${process.env.BACKEND_URL}/biometrics/register`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        }).then((res) => res.json());
}

export async function postRegistrationResult(token, attestation) {
    return await fetch(
        `${process.env.BACKEND_URL}/biometrics/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                attestation
            }),
        }).then((res) => res.json());
}

export async function getLoginChallenge() {
    return await fetch(
        `${process.env.BACKEND_URL}/biometrics/login`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
}

export async function postLoginResult(objToSend) {
    return await fetch(
        `${process.env.BACKEND_URL}/biometrics/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(objToSend),
        }).then((res) => res.json());
}