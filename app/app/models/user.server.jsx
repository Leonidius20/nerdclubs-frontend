export async function getUsers() {
    return await fetch(
        `${process.env.BACKEND_URL}/users`
    ).then((res) => res.json());
}