import stylesUrl from "~/styles/forms.css";
import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { isUserAuthenticated } from "../cookies";
import { register } from "~/utils/auth.server";
import { getSession, commitSession } from "~/cookies";

export const meta = () => {
    return [{ title: "Register" }];
};

export const links = () => [
    { rel: "stylesheet", href: stylesUrl },
]

export const loader = async ({ request }) => {
    if (await isUserAuthenticated(request)) {
        redirect("/");
    }
    return json({});
}

export const action = async ({ request }) => {
    const form = await request.formData();
    const username = form.get("username");
    const email = form.get("email");
    const password = form.get("password");
    const password2 = form.get("password2");

    if (!username || !email || !password || !password2 || username.length < 3 || password.length < 8 || username.length > 20 || password.length > 20) {
        return json({ message: "Invalid input format" }, { status: 400 });
    }

    if (password !== password2) {
        return json({ message: "Passwords do not match" }, { status: 400 });
    }

    if (!email.includes("@")) {
        return json({ message: "Invalid email" }, { status: 400 });
    }

    const registrationResult = await register(username, password, email);
    if (!registrationResult || !registrationResult.token) {
        return json({ message: "Internal Server Error. Backend says: " + registrationResult.message}, { status: 500 });
    }

    // save token in cookie
    const jwtToken = registrationResult.token;
    const session = await getSession(request.headers.get("Cookie"));
    session.set("token", jwtToken);
    const cookie = await commitSession(session);

    // redirect to 2fa page
    return redirect("/register/2fa", { headers: {"Set-Cookie": cookie} });
}

export default function Register() {
    const actionData = useActionData();
    return (
        <main>
            <h1>Register</h1>
            <div id="error-message-box">
                {actionData?.message && <p role="alert">{actionData.message}</p>}
            </div>
            <form method="post">
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="Username" required />
                    <small>between 3 and 20 characters</small>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Email" required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Password" required />
                    <small>between 8 and 20 characters</small>
                </div>
                <div>
                    <label htmlFor="password2">Repeat password</label>
                    <input type="password" id="password2" name="password2" placeholder="Repeat password" required />
                </div>
                <button type="submit">Register</button>
            </form>
        </main>
    )
}