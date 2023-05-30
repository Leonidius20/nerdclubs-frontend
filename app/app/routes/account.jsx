import styleCss from "~/styles/card.css";
import { getUserDataByToken } from "~/models/user.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Card from "../components/card";

export const meta = () => {
    return [{ title: "User Data" }];
}

export const links = () => [
    { rel: "stylesheet", href: styleCss },
]

export const loader = async ({request}) => {
    try {
        const userData = await getUserDataByToken(request);

        if (!userData) {
            return json( {
                    message: "Remote server error",
            }, { status: 401 });
        }

        return json(userData);
    } catch (error) {
        return json( {
                message: "Uable to load user data",
        }, { status: 401 });
    }
};

export default function UserData() {
    const userData = useLoaderData();

    return (
        <Card title="User Data" backUrl="/" message={userData.message}>
            <h2>Username</h2>
            <p>{userData?.username}</p>
            <h2>Email</h2>
            <p>{userData?.email}</p>
            <h2>Account creation date</h2>
            <p>{userData?.created_at}</p>
            
            {userData?.privilege_level !== 1 && <h2>Privilege level</h2>}
            {userData?.privilege_level !== 1 && <p>{userData?.privilege_level}</p>}

            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                    <h2>Biometric auth</h2>
                    <p>{userData?.biometric_enabled ? "Enabled" : "Disabled"}</p>
                </div>
                {(userData && !userData.biometric_enabled) &&
                    <a href="register/biometric" className="link-button">Enable</a>
                }
            </div>
           
            {/*<main>
                <h1>User Data</h1>
                {userData?.message &&
                    <div id="error-message-box">
                        <p role="alert">{userData.message}</p>          
                    </div>
                }
                
            </main>*/}
        </Card>
        
    );
}