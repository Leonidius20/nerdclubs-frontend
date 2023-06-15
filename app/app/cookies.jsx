import { createCookie, createCookieSessionStorage } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { verifyToken } from "~/utils/auth.server";
import jwt_decode from "jwt-decode";

export const { getSession, commitSession, destroySession } = createCookieSessionStorage ({
    cookie: {
        name: "token",
    },
});

export const isNotBannedOrThrow = async (request) => {
    const session = await getSession(request.headers.get("Cookie"));
    if (session && session.get("token")) {
        const encodedToken = session.get("token");
        const decodedToken = jwt_decode(encodedToken);
        if (decodedToken["is_banned"] === true) {
            throw redirect("/banned");
        }
        return true;
    } else {
        return true;
    }
}


export const getToken = async (request) => {
    const session = await getSession(request.headers.get("Cookie"));
    if (session && session.get("token")) {
        return session.get("token");
    } else {
        return null;
    }
}

export const getUserInfoOrNull = async (request) => {
    const session = await getSession(request.headers.get("Cookie"));
    if (session && session.get("token")) {
        const token = session.get("token");
        const decodedToken = jwt_decode(token);
        return {
            userId: decodedToken["user_id"],
            username: decodedToken["username"],
            twofaPassed: decodedToken["twofa_passed"],
            twofaEnabled: decodedToken["twofa_enabled"],
        };
    } else {
        return null;
    }
}

export const isUserFullyAuthenticated = async (request) => {
    const session = await getSession(request.headers.get("Cookie"));

    if (session && session.get("token")) {
        const token = session.get("token");
        const decodedToken = jwt_decode(token);
        request._userId = decodedToken["user_id"];
        request._username = decodedToken["username"];
        request._token = token;
        return decodedToken["twofa_passed"];
    } else {
        return false;
    }
}

export const isUserAuthenticated = async (request) => {
    const session = await getSession(request.headers.get("Cookie"));
    if (session && session.get("token")) {
        return true;
    } else {
        return false;
    }
}

export const is2faEnabled = async (request) => {
    const session = await getSession(request.headers.get("Cookie"));
    if (session && session.get("token")) {
        const decodedToken = jwt_decode(session.get("token"));
        return decodedToken["twofa_enabled"] === true;
    } else {
        return false;
    }
}

/**
 * Verification sequence when authourized access is needed:
 * 1. Check if token is present in cookie
 * 2. If not, redirect to login page
 * 3. If yes, verify token with server
 * 4. If token is invalid, redirect to login page and clear cookie
 * 5. Check if 2fa is enabled
 * 6. If not, let user in
 * 7. If yes, check if 2fa is passed according to cookie token
 * 8. If not, redirect to 2fa page
 * 9. If yes, let user in
 */

export async function requireUserSession(request) {
    // get the session
    const cookie = request.headers.get("Cookie");
    const session = await getSession(cookie);

    if (!session || !session.get("token")) {
        // if there is no user session, redirect to login
        throw redirect("/login");
    }

    // verify token with server
    /*const response = await verifyToken(session.get("token"));
    if (!response || (response.valid !== true)) {
        // if token is invalid, redirect to login page and clear cookie
        await destroySession(session);
        throw redirect("/login");
    }

    // check if 2fa is enabled
    const decodedToken = jwt_decode(session.get("token"));
    if (decodedToken["twofa_enabled"] !== true) {
        // if 2fa is not enabled, let user in
        return session;
    }

    // check if 2fa is passed according to cookie token
    if (decodedToken["twofa_passed"] !== true) {
        // if 2fa is not passed, redirect to 2fa page
        throw redirect("/login/2fa");
    }*/

    // if 2fa is passed, let user in
    return session;
  }