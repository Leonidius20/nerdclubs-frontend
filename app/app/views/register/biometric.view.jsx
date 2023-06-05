import { useState, useEffect, useRef } from 'react';
import { decode, encode } from 'base64-arraybuffer';
import { useFetcher } from "@remix-run/react";
import { Bars } from 'react-loader-spinner';
import Card from '../../components/card';

export default function RegisterBiometricView({ attestation, jwtToken, errrorMessage }) {
    const fetcher = useFetcher();

    const [isBiometricAuthSupported, setIsBiometricAuthSupported] = useState(true);
    const scriptRanOnce = useRef(false);
    const [isErrorHappened, setIsErrorHappened] = useState(false);
    const [errorMessage, setErrorMessage] = useState(errrorMessage);

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
            const handleBioError = () => {
                    setErrorMessage("No credential received. Reload the page and try again.");
                    setRetryAvailable(true);
                    scriptRanOnce.current = true;
                }

            try {
                const credential = await navigator.credentials.create({
                    publicKey: attestation,
                });

                if (!credential) {
                    setIsErrorHappened(true); // not sure if it works of async
                    handleBioError();
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
            } catch (e) {
                setIsErrorHappened(true);
                handleBioError();
                return;
            }
        })();

        scriptRanOnce.current = true;
        
    }, [attestation, jwtToken, fetcher]);

    return (
        <Card title="Biometric auth" message={errorMessage}>
             <noscript>JavaScript has to be enabled in browser for this to work.</noscript>
            {
                !isErrorHappened &&
                (isBiometricAuthSupported 
                    ? <p>Biometric auth is supported. Follow directions on the screen</p>
                    : <p>Biometric auth is not supported.</p>)
            }
            { /*<script type="module" src="/scripts/register.biometric.js"></script>*/}
            <fetcher.Form method="post" action="/">
                <input type="hidden" name="encodedCredential" />
            </fetcher.Form>

            {
                isErrorHappened ?
                <a className="link-button" href="/register/biometric">Retry</a> : 
                <Bars height="80" width="80" color="#000000" ariaLabel="bars-loading" visible={(fetcher.state == 'idle' || fetcher.state == 'loading')}/>
            }
           
            
            
        </Card>
    )
}