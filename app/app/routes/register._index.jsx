import stylesUrl from "~/styles/forms.css";
import cardCss from "~/styles/card.base.css";
import cardNarrow from "~/styles/card.narrow.css";
import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { isUserFullyAuthenticated, isUserAuthenticated, is2faEnabled } from "../cookies";
import { register } from "~/utils/auth.server";
import { getSession, commitSession } from "~/cookies";
import RegisterView from "../views/register";

export const handle = { hydrate: true };

export const meta = () => {
    return [{ title: "Register" }];
};

export const links = () => [
    { rel: "stylesheet", href: stylesUrl },
    { rel: "stylesheet", href: cardCss },
    { rel: "stylesheet", href: cardNarrow },
]

export const loader = async ({ request }) => {
    if (await isUserAuthenticated(request)) {
        if (await is2faEnabled(request)) {
            return redirect("/");
        } else {
            return redirect("/register/suggestion/biometric");
        }
    } else {
        return json({});
    }
}

export const action = async ({ request }) => {
    const form = await request.formData();
    const username = form.get("username");
    const email = form.get("email");
    const password = form.get("password");
    const password2 = form.get("password2");

    if (!username || !email || !password || !password2) {
        return json({ message: "All required fields should be filled out" }, { status: 400 });
    }

    if ( username.length < 3 || username.length > 20) {
        return json({ message: "Username should be between 3 and 20 characters" }, { status: 400 });
    }

    if (!/^[A-Za-z0-9_\-]*$/.test(username)) { 
        return json({ message: "Username can only contain only English letters, numbers, underscores and hyphens" }, { status: 400 });
    }

    if (password.length < 8 || password.length > 20) {
        return json({ message: "Password should be between 8 and 20 characters" }, { status: 400 });
    }

    if (!/^[A-Za-z0-9$.@,#_\-]*$/.test(password)) { 
        return json({ message: "Password can only contain only English letters, numbers and the following symbols: $.@,#_-" }, { status: 400 });
    }

    if (password !== password2) {
        return json({ message: "Passwords do not match" }, { status: 400 });
    }

    if (!email.includes("@")) {
        return json({ message: "Invalid email" }, { status: 400 });
    }

    



    const registrationResult = await register(username, password, email);
    if (!registrationResult || !registrationResult.token) {
        return json({ message: registrationResult.message}, { status: 500 });
    }

    // save token in cookie
    const jwtToken = registrationResult.token;
    const session = await getSession(request.headers.get("Cookie"));
    session.set("token", jwtToken);
    const cookie = await commitSession(session);

    // redirect to 2fa page
    return redirect("/register/suggestion/biometric", { headers: {"Set-Cookie": cookie} });
}

export default function Register() {
    const actionData = useActionData();
    const errorMessage = actionData?.message;
    return (
       <RegisterView errrorMessage={errorMessage}/>
    )
}
