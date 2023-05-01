export async function getUsers() {
    return await fetch(
        `${process.env.BACKEND_URL}/users`
    ).then((res) => res.json());
}

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