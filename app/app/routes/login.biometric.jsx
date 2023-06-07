import styleCss from "~/styles/card.base.css";
import cardNarrowCss from "~/styles/card.narrow.css";
import { json, redirect, status } from "@remix-run/node";
import { useActionData, useLoaderData, useFetcher } from "@remix-run/react";
import { getSession, commitSession } from "~/cookies";
import { useState, useEffect, useRef } from "react";
import { getLoginChallenge, postLoginResult } from "../models/biometric.server";
import { decode, encode } from "base64-arraybuffer";
import Card from "../components/card";
import { Bars } from "react-loader-spinner";

export const handle = { hydrate: true };

export const meta = () => {
    return [{ title: "Log in" }];
};

export const links = () => [
    { rel: "stylesheet", href: styleCss },
    { rel: "stylesheet", href: cardNarrowCss },
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
    if (!serverResponse.token) {
        return json({ error: "Error logging in" }); // todo display nicely
    }

    const session = await getSession(request.headers.get("Cookie"));
    session.set("token", serverResponse.token);
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
    const [isBiometricAuthSupported, setIsBiometricAuthSupported] = useState(true);
    const [errorMessage, setErrorMessage] = useState(error);
    const [retryAvailable, setRetryAvailable] = useState(false);

    const fetcher = useFetcher();

    const scriptRanOnce = useRef(false);

    delete options.timeout;

    useEffect(() => {
        if (scriptRanOnce.current) return;

        if (!window.PublicKeyCredential) {
            setIsBiometricAuthSupported(false);
            return;
        }

        (async () => {
            const decodedOptions = {
                ...options,
                challenge: decode(options.challenge),
            };

            const handleBioError = () => {
                setErrorMessage("No credential received. Reload the page and try again.");
                setRetryAvailable(true);
            }

            try {
                const credential = await navigator.credentials.get({
                    publicKey: decodedOptions
                });

                if (!credential) {
                    handleBioError();
                    return;
                }

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

            } catch (e) {
                handleBioError();
                return;
            }
        })();

        scriptRanOnce.current = true;

        return () => {
            // cleanup, probably not needed
        }

    }, [options, fetcher]);

    return (
        <Card title="Login with biometrics" message={errorMessage}>        
            <noscript>JavaScript has to be enabled in browser for this to work.</noscript>
            {
                (!retryAvailable) &&
                (isBiometricAuthSupported 
                    ? <p>Follow directions on the screen.</p>
                    : <p>Biometric auth is not supported.</p>)
            }
            { /*<script type="module" src="/scripts/register.biometric.js"></script>*/}
            <fetcher.Form method="post" action="/">
                <input type="hidden" name="objToSend" />
            </fetcher.Form>
            {
                retryAvailable ? <a className="link-button" href="/login/biometric">Retry</a> :
                <Bars height="80" width="80" color="#000000" ariaLabel="bars-loading" visible={(fetcher.state == 'idle' || fetcher.state == 'loading')} wrapperStyle={{display: 'flex', justifyContent: 'center', marginTop: '15px'}}/>
            }
            
        </Card>
    )
}