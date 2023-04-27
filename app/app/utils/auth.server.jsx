
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