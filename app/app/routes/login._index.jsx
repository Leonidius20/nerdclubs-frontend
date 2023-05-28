import Card from "../components/card";

import cardCss from "~/styles/card.css";
import formsCss from "~/styles/forms.css";
import postCardCss from "../styles/post.card.css";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import List from "../components/list";
import { isUserFullyAuthenticated, isUserAuthenticated } from "../cookies";

export const links = () => [ 
    { rel: "stylesheet", href: cardCss },
];

export const loader = async ({request}) => {
    // check if already logged in
    if (await isUserAuthenticated(request)) {
        if (await isUserFullyAuthenticated(request)) { // todo remove 2fa
            return redirect("/");
        } else {
            return redirect("/login/2fa");
        }
    } else {
        return json({
            methods: [
                {
                    name: "Password",
                    url: "/login/password",
                    available: true,
                    comment: "Login with username and password",
                },
                {
                    name: "Biometric / Hardware",
                    url: "/login/biometric",
                    available: false,
                    comment: "Biometric auth",
                },
            ],
        });
    }
}


export default function LoginIndex({}) {
    const { methods } = useLoaderData();

    useEffect(() => {
        // check if biometric auth is available
        if (window.PublicKeyCredential) {
            methods[1].available = true;
        }
    }, [methods]);

    return (
        <Card title="Login method" backUrl="/">
            <List content={methods} />
        </Card>
    );
}