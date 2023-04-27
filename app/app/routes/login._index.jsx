import stylesUrl from "~/styles/forms.css";
import { json } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";

export const meta = () => {
    return [{ title: "Log in" }];
  };

export const links = () => [
    { rel: "stylesheet", href: stylesUrl },
]

export const action = async ({ request }) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");
    const redirectTo = form.get("redirectTo");

    if (!username || !password || username.length < 3) {
        return json({ message: "Invalid username or password format" }, { status: 400 });
    }

    return json({ message: "not implemented" }, { status: 501 });
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
                    <input type="text" name="username" id="username" />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" />
                </div>
                <button type="submit">Login</button>
            </form>
        </main>
    )
}