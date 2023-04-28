import { isUserFullyAuthenticated, is2faEnabled } from "../cookies"
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
            const twofa_methods = [
                { 
                    name: "Authenticator App", 
                    url: "/register/2fa/otp",
                    comment: null,
                    available: true,
                    enabled: false,
                },
                { 
                    name: "Biometrics", 
                    url: "/register/2fa/biometric", 
                    comment: "Not available yet",
                    available: false,
                    enabled: false,
                }
            ];

            return json(twofa_methods);
        }
    } else { // not logged in at all
        console.log("not logged in at all");
        return redirect("/register");
    }
}

export default function RegisterAdd2fa() {
    const twofa_methods = useLoaderData();

    return (
        <main>
            <h1>Add 2FA methods</h1>
            <p>You can add multiple two-factor authentication methods. When you are done, press Continue.</p>
            <ul>
                {twofa_methods.map(method => <TwofaMethodListItem method={method} />)}

                
            </ul>
            <a href="/register/success" class="link-button">Continue</a>
        </main>
    )
}

function TwofaMethodListItem(method) {
    method = method.method; // what the fuck
    // todo method availability as class
    return (
        <li>
            <a href={method.url} className={method.available ? "available" : "unavailable"}>
                    <img src={method.enabled ? "/icons/done.svg" : "/icons/add.svg"} alt="" role="presentation" />
                    <div>
                        <p>{method.name}</p>
                        <small>{method.comment}</small>
                    </div>
            </a>
        </li>
    );
}