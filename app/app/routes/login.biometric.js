import styleCss from "~/styles/card.css";
import { json, redirect, status } from "@remix-run/node";
import { useActionData, useLoaderData, useFetcher } from "@remix-run/react";
import { getSession, commitSession } from "~/cookies";
import { useEffect, useRef } from "react";
import { getLoginChallenge, postLoginResult } from "../models/biometric.server";
import { decode, encode } from "base64-arraybuffer";

export const handle = { hydrate: true };

export const meta = () => {
    return [{ title: "Log in" }];
};

export const links = () => [
    { rel: "stylesheet", href: styleCss },
]

export const loader = async ({ request }) => {
    // load challenge from server
    const response = await getLoginChallenge();
    const rawAssertion = response.options;

    return json({ options: rawAssertion });
}

export const action = async ({ request }) => {
    // get credential and send it back to server

    const form = await request.formData();
    const objToSendJson = form.get("objToSend");
    const objToSend = JSON.parse(objToSendJson);
    

    // tot errror hanlding
    const serverResponse = await postLoginResult(objToSend);
    if (!serverResponse.jwtToken) {
        return json({ error: "Error logging in" }); // todo display nicely
    }

    const session = await getSession(request.headers.get("Cookie"));
    session.set("token", serverResponse.jwtToken);
    const cookie = await commitSession(session);

    return redirect("/?index", {
        headers: {
            "Set-Cookie": cookie,
        },
    });
};

export default function LoginBiometricController() {
    const { options } = useLoaderData();
    const { error } = useActionData() || {};

    const fetcher = useFetcher();

    const scriptRanOnce = useRef(false);

    delete options.timeout;

    useEffect(() => {
        if (scriptRanOnce.current) return;

        (async () => {
            const decodedOptions = {
                ...options,
                challenge: decode(options.challenge),
            };

            const credential = await navigator.credentials.get({
                publicKey: decodedOptions
            });

            const encodedCredential = {
                ...credential,
                id: credential.id,
                rawId: encode(credential.rawId),
                response: {
                    ...credential.response,
                    clientDataJSON: encode(credential.response.clientDataJSON),
                    authenticatorData: encode(credential.response.authenticatorData),
                    signature: encode(credential.response.signature),
                    userHandle: encode(credential.response.userHandle),
                },
                type: credential.type,
            };

            const objToSend = {
                credential: encodedCredential,
                challenge: options.challenge, // send challenge back to server
            };

            // send it using fetcher
            fetcher.submit( {objToSend: JSON.stringify(objToSend)}, { method: "post" });

        })();

        scriptRanOnce.current = true;

    }, [options, fetcher]);

    return (
        <main>
            <h1>Login with biometrics</h1>
            {error &&
            <div id="error-message-box">
                <p role="alert">{error}</p>
            </div>
            }
            
            <noscript>JavaScript has to be enabled in browser for this to work.</noscript>
            {/*isBiometricAuthSupported ? <p>Biometric auth is supported. Follow directions on the screen</p> : <p>Biometric auth is not supported.</p>*/}
            { /*<script type="module" src="/scripts/register.biometric.js"></script>*/}
            <fetcher.Form reloadDocument method="post">
                <input type="hidden" name="objToSend" />
            </fetcher.Form>
        </main>
    )
}