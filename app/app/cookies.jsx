import { createCookie, createCookieSessionStorage } from "@remix-run/node";

export const { getSession, commitSession, destroySession } = createCookieSessionStorage ({
    cookie: {
        name: "token",
    },
});
