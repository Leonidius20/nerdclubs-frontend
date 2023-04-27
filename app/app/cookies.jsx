import { createCookie, createCookieSessionStorage } from "@remix-run/node";
import jwt_decode from "jwt-decode";

export const { getSession, commitSession, destroySession } = createCookieSessionStorage ({
    cookie: {
        name: "token",
    },
});

export const isUserFullyAuthenticated = async (request) => {
    const session = await getSession(request.headers.get("Cookie"));
    if (session && session.get("token")) {
        const decodedToken = jwt_decode(session.get("token"));
        return decodedToken["twofa_passed"];
    } else {
        return false;
    }
}