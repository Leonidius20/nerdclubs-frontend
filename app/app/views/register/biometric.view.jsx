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

            /*const response = credsResponse.response;
            const clientDataJSON = response.clientDataJSON; // encdoed as ArrayBuffer
            const clientDataJSONString = new TextDecoder().decode(clientDataJSON);
            const clientData = JSON.parse(clientDataJSONString);
            const base64urlEncodedChallenge = clientData.challenge;
            const decodedChallengeArray = Uint8Array.from(atob(base64urlEncodedChallenge), c => c.charCodeAt(0));
        
            if (decodedChallengeArray.toString() !== challenge.toString()) {
                console.log(decodedChallengeArray, challenge)
                throw new Error("Challenge is not the same");
            }

            const originUrl = new URL(clientData.origin);
            if (originUrl.hostname !== host) {
                console.log(originUrl.hostname, host)
                throw new Error("Origin is not the same");
            }
            if (clientData.type !== "webauthn.create") {
                throw new Error("Type is not the same");
            }*/

            //const encodedAttestationObject = response.attestationObject;
            //const attestationObject = CBOR.decode(encodedAttestationObject);
            //console.log(attestationObject);
            //const encodedAuthData = attestationObject.authData; 

            //const credentialIdLengthFirstByte = encodedAuthData[53]; // 53 is the offset of the credentialIdLength
            //const credentialIdLengthSecondByte = encodedAuthData[54]; // 54 is the offset of the credentialIdLength
            //const credentialIdLength = (credentialIdLengthFirstByte << 8) + credentialIdLengthSecondByte;


            //const credentials = attestationObject.authData.attestedCredentialData;
           // const credentialId = credsResponse.rawId; // byte array
            //const credentialPublicKey = response.getPublicKey(); 

           // console.log(credentialId, credentialPublicKey); // todo: send to server


            // now try to login with biometric auth
            /*navigator.credentials.get({
                publicKey: {
                    rpId: host,
                   /* allowCredentials: [
                        {
                            type: "public-key",
                            id: credentialId,
                        }
                    ],*/
                    /*challenge: challenge,
                    status: "ok",
                    //userVerification: "required", // maybe remove
                }
            }).then((credsResponse) => {
                const response = credsResponse.response;
                console.log("login resp", response);*/
                /*const clientDataJSON = response.clientDataJSON; // encdoed as ArrayBuffer
                const clientDataJSONString = new TextDecoder().decode(clientDataJSON);
                const clientData = JSON.parse(clientDataJSONString);
                const base64urlEncodedChallenge = clientData.challenge;
                const decodedChallengeArray = Uint8Array.from(atob(base64urlEncodedChallenge), c => c.charCodeAt(0));
                
                if (decodedChallengeArray.toString() !== challenge.toString()) {
                    console.log(decodedChallengeArray, challenge)
                    throw new Error("Challenge is not the same");
                }

                const originUrl = new URL(clientData.origin);
                if (originUrl.hostname !== host) {
                    console.log(originUrl.hostname, host)
                    throw new Error("Origin is not the same");
                }

                if (clientData.type !== "webauthn.get") {
                    throw new Error("Type is not the same");
                }

                const credentialId = credsResponse.rawId;
                const credentialPublicKey = response.getPublicKey();*/
            /*}).catch((err) => {
                console.log(err);
            });*/

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