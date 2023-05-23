import stylesUrl from "~/styles/forms.css";
import twofaqrStylesUrl from "~/styles/2faqr.css";
import { get2faSecret, verify2faEnabling } from "../utils/auth.server";
import { getToken, getSession, commitSession } from "~/cookies";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";
import QRCode from "react-qr-code";

export const meta = () => {
    return [{ title: "Register" }];
}

export const links = () => [
    { rel: "stylesheet", href: stylesUrl },
    { rel: "stylesheet", href: twofaqrStylesUrl },
]

async function return2faSecretOrError(request) {
    const response = await get2faSecret(await getToken(request));
    if (!response || !response.secret) {
        console.log("Failed to get 2fa secret from server" + response);
        return { message: "Failed to get 2fa secret from server " + response.message };
    }
    return { secret: response.secret };
}

export const loader = async ({request}) => {
    return json(await return2faSecretOrError(request));
}

export const action = async ({request}) => {
   // const { secret } = useLoaderData(); // is it allowerd
    const form = await request.formData();
    const otp = form.get("otp");

    if (!otp || otp.length !== 6) {
        const secretAndMessage = await return2faSecretOrError(request);
        secretAndMessage.message = "Invalid code";
        return json(secretAndMessage, { status: 400 });
    }

    // verify 2fa code with server and get token
    const response = await verify2faEnabling(await getToken(request), otp);
    if (!response || !response.token) {
        const secretAndMessage = await return2faSecretOrError(request);
        secretAndMessage.message = "Failed to verify 2fa code with server: " + response.message;
        return json(secretAndMessage, { status: 500 });
    }

    // save token to cookie
    const session = await getSession(request.headers.get("Cookie"));
    session.set("token", response.token);
    const cookie = await commitSession(session);

    return redirect("/", { headers: { "Set-Cookie": cookie } });
}

export default function AddOtp2faMethod() {
    const { secret, message } = useLoaderData();
    const actionData = useActionData();

    return (
        <main>
            <h1>Add OTP 2FA</h1>
            <div id="error-message-box">
                {message && <p role="alert">{message}</p>}
                {actionData?.message && <p role="alert">{actionData.message}</p>}
            </div>
            <p>Scan the QR code below with your authenticator app. Then input a 6-digit code generated by the app into the box below and press Verify.</p>
            {secret && <QRCode value={secret} />}
            <small><a href={secret}>{secret}</a></small>
            <form method="post">
                <label for="otp">Code</label>
                <input type="number" id="otp" name="otp" />
                <button type="submit">Verify</button>
            </form>
        </main>
    );
}