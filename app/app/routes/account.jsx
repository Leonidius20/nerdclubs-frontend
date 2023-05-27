import styleCss from "~/styles/card.css";
import { requireUserSession } from "~/cookies";
import { getUserDataByToken } from "~/models/user.server";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta = () => {
    return [{ title: "User Data" }];
}

export const links = () => [
    { rel: "stylesheet", href: styleCss },
]

export const loader = async ({request}) => {
    const session = await requireUserSession(request);
    
    // load user data from db
    const userData = await getUserDataByToken(session.get("token"));
    console.log("userData: " + JSON.stringify(userData));
    if (!userData) {
        return json( {
                message: "Unauthorized",
        }, { status: 401 });
    }

    return json(userData);
};

export default function UserData() {
    const userData = useLoaderData();

    return (
        <main>
            <h1>User Data</h1>
            {userData?.message &&
                <div id="error-message-box">
                    <p role="alert">{userData.message}</p>          
                </div>
            }
            <h2>Username</h2>
            <p>{userData?.username}</p>
            <h2>Email</h2>
            <p>{userData?.email}</p>
            <h2>Account creation date</h2>
            <p>{userData?.created_at}</p>
            {/*<h2>2FA</h2>
            <p>{userData?.twofa_confirmed ? "Enabled" : "Disabled"}</p>*/}
            {userData?.privilege_level !== 1 && <h2>Privilege level</h2>}
            {userData?.privilege_level !== 1 && <p>{userData?.privilege_level}</p>}
            <a href="/" class="link-button">Back to Homepage</a>
        </main>
    );
}