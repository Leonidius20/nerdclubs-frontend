import stylesUrl from "~/styles/forms.css";
import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { login } from "~/utils/auth.server";
import jwt_decode from "jwt-decode";
import { getSession } from "~/cookies";
import { commitSession, isUserAuthenticated, isUserFullyAuthenticated } from "../cookies";

export const meta = () => {
    return [{ title: "Log in" }];
};

export const links = () => [
    { rel: "stylesheet", href: stylesUrl },
]

export const loader = async ({ request }) => {
    // check if the user is already logged in
    if (await isUserAuthenticated(request)) {
        if (await isUserFullyAuthenticated(request)) {
            return redirect("/");
        } else {
            return redirect("/login/2fa");
        }
    } else {
        return json({});
    }
}

export const action = async ({ request }) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");
    const redirectTo = form.get("redirectTo");

    if (!username || !password || username.length < 3) {
        return json({ message: "Invalid username or password format" }, { status: 400 });
    }

    const user = await login(username, password);
    if (!user || !user.token) {
        return json({ message: "Invalid username or password or Internal Server Error. Go figure. Backend says: " + user.message}, { status: 401 });
    }

    const jwtToken = user.token;

    // set cookie
    const session = await getSession(request.headers.get("Cookie"));
    session.set("token", jwtToken);
    const cookie = await commitSession(session);

    const decodedToken = jwt_decode(jwtToken);

    if (!decodedToken["twofa_passed"]) {
        return redirect("/login/2fa" + (redirectTo ? "?redirectTo=" + redirectTo : ""), { headers: {"Set-Cookie": cookie} });
    } else {
        return redirect(redirectTo ? "/" + redirectTo : "/", { headers: {"Set-Cookie": cookie} });
    }
}

export default function LoginRoute() {
    const [searchParams] = useSearchParams();
    const actionData = useActionData();
    return(
        <main>
            <h1>Login</h1>
            <div id="error-message-box">
                {actionData?.message && <p role="alert">{actionData.message}</p>}
            </div>
            <form method="post">
                <input type="hidden" name="redirectTo" value={searchParams.get("redirectTo")} />
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" required />
                </div>
                <button type="submit">Login</button>
            </form>
        </main>
    )
}