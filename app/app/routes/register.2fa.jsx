import { isUserFullyAuthenticated, is2faEnabled } from "../cookies"
import { json, redirect } from "@remix-run/node";
import stylesUrl from "~/styles/forms.css";

export const meta = () => {
    return [{ title: "Register" }];
};

export const links = () => [
    { rel: "stylesheet", href: stylesUrl },
]

export const loader = async ({request}) => {
    // check cookie to see if the user is already logged in and whether
    // they have passed 2fa

    if (await isUserFullyAuthenticated(request)) {
        if (await is2faEnabled(request)) {
            console.log("2fa already enabled");
            return redirect("/");
        } else {
            return json({});
        }
    } else { // not logged in at all
        console.log("not logged in at all");
        return redirect("/register");
    }
}

export default function RegisterAdd2fa() {
    return (
        <main>
            <h1>Add 2FA methods</h1>
            <ul>
                <li>
                    <a href="/register/2fa/otp">Authenticator App</a>
                </li>
                <li>
                    <a href="/register/2fa/biometric">
                        Biometrics
                        <small>Not available yet</small>
                    </a>
                </li>
            </ul>
            <a href="/register/success" class="link-button">Skip</a>
        </main>
    )
}