import { useState, useEffect, useRef } from 'react';
import { decode, encode } from 'base64-arraybuffer';
import { postRegistrationResult } from '../../models/biometric.server';
import { useFetcher } from "@remix-run/react";
import { Bars } from 'react-loader-spinner';
import Card from '../../components/card';

export default function RegisterBiometricView({ attestation, jwtToken, errrorMessage }) {
    const fetcher = useFetcher();

    const [isBiometricAuthSupported, setIsBiometricAuthSupported] = useState(true);
    const scriptRanOnce = useRef(false);
    const [isRegistered, setIsRegistered] = useState(false); // whether biometric verification was completed
    const [isErrorHappened, setIsErrorHappened] = useState(false);

    console.log("challengeDataBefore: ", attestation);
    // convert from base64 back to byte array
    

    delete attestation.timeout;

    //userId =  Uint8Array.from(atob(userId), c=>c.charCodeAt(0)) || new Uint8Array(16);
    // username = username || "test";
    
    useEffect(() => {
        if (scriptRanOnce.current) return;

        if (!window.PublicKeyCredential) {
            setIsBiometricAuthSupported(false);
            return;
        }

        attestation.challenge = decode(attestation.challenge);
        attestation.user.id = decode(attestation.user.id);


        // asynchronously get response from authenticator
        (async () => {
            const credential = await navigator.credentials.create({
                publicKey: attestation,
            });

            if (!credential) {
                setIsErrorHappened(true); // not sure if it works of async
                return;
            }

            // encode some of the data to base64
            const encodedCredential = {
                ...credential,
                id: credential.id,
                rawId: encode(credential.rawId),
                response: {
                    ...credential.response, // needed?
                    attestationObject: encode(credential.response.attestationObject),
                    clientDataJSON: encode(credential.response.clientDataJSON),
                },
                type: credential.type,
            }

            // send credential to server
            console.log("encoded cred", encodedCredential);
            // todo: send credential to frontend server usering Remix functionalituy
            fetcher.submit({ encodedCredential: JSON.stringify(encodedCredential) }, { method: "post" });

        })();

        scriptRanOnce.current = true;

        setIsRegistered(true);

        





        return () => {
            // cleanup function
        }
        
    }, [attestation, jwtToken, fetcher]);

    const finalErrorMessage = errrorMessage 
    || (isErrorHappened ? "Error. Reload the page to try again" : null);

    return (
        <Card title="Biometric auth" message={finalErrorMessage}>
             <noscript>JavaScript has to be enabled in browser for this to work.</noscript>
            {isBiometricAuthSupported ? <p>Biometric auth is supported. Follow directions on the screen</p> : <p>Biometric auth is not supported.</p>}
            { /*<script type="module" src="/scripts/register.biometric.js"></script>*/}
            <fetcher.Form method="post" action="/">
                <input type="hidden" name="encodedCredential" />
            </fetcher.Form>

           
            
            
            <Bars height="80" width="80" color="#000000" ariaLabel="bars-loading" visible={(fetcher.state == 'idle' || fetcher.state == 'loading')}/>
        </Card>
    )
}