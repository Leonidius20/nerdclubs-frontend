import { useActionData, useLoaderData, useSearchParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import stylesUrl from "~/styles/forms.css";
import { getSession } from "~/cookies";
import { commitSession } from "../cookies";
import jwt_decode from "jwt-decode";
import { verity2faOtp } from "../utils/auth.server";

export const meta = () => {
    return [{ title: "2FA (OTP)" }];
};

export const links = () => [
    { rel: "stylesheet", href: stylesUrl },
]

export const loader = async ({request}) => {
    //const [searchParams] = useSearchParams();
    //const redirectTo = searchParams.get("redirectTo");

    // check cookie to see if the user is already logged in and whether
    // they have passed 2fa
    const session = await getSession(request.headers.get("Cookie"));
    if (!session || !session.get("token")) {
        return redirect("/login");
    }

    const decodedToken = jwt_decode(session.get("token"));
    if (decodedToken["twofa_passed"]) {
        return redirect("/"); // todo: redirect to redirectTo
    }

    const cookie = await commitSession(session);

    return json(
     { headers: { "Set-Cookie": cookie } });
     // todo: check if this cookie re-setting is necessary
}

export const action = async ({ request }) => {
    const form = await request.formData();
    const otp = form.get("otp");
    const redirectTo = form.get("redirectTo");

    if (!otp || otp.length < 6) {
        return json({ message: "Invalid OTP format" }, { status: 400 });
    }

    // get current token from cookie
    const session = await getSession(request.headers.get("Cookie"));
    if (!session || !session.get("token")) {
        return redirect("/login");
    }
    let jwtToken = session.get("token");

    // submit OTP to the backend
    const otpVerificationResult = await verity2faOtp(otp, jwtToken);
    if (!otpVerificationResult || !otpVerificationResult.token) {
        await commitSession(session); // is it needed?
        return json({ message: "Invalid OTP or Internal Server Error. Go figure. Backend says: " + otpVerificationResult.message}, { status: 401 });
    }

    jwtToken = otpVerificationResult.token;

    // set cookie with new token
    session.set("token", jwtToken);
    const cookie = await commitSession(session);

    if (redirectTo) {
        return redirect("/" + redirectTo, { headers: {"Set-Cookie": cookie} });
    } else {
        return redirect("/", { headers: {"Set-Cookie": cookie} });
    }
}

export default function Login2faOtp() {
    const [searchParams] = useSearchParams();
    const actionData = useActionData();
    const loaderData = useLoaderData();

    return (
        <main>
            <h1>2FA (OTP)</h1>
            <div id="error-message-box">
                {actionData?.message && <p role="alert">{actionData.message}</p>}
            </div>
            <form method="post">
                <input type="hidden" name="redirectTo" value={searchParams.get("redirectTo")} />
                <div>
                    <label htmlFor="otp">OTP</label>
                    <input type="number" name="otp" id="otp" />
                </div>
                <button type="submit">Verify</button>
            </form>
        </main>
    );
}