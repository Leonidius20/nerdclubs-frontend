import Card from "../components/card";
import cardCss from "~/styles/card.css";
import { json, redirect } from "@remix-run/node";
import { isUserAuthenticated } from "../cookies";

export const links = () => [
    { rel: "stylesheet", href: cardCss },
];

export const loader = async ({request}) => {
    // check if is not logged in
    if (!(await isUserAuthenticated(request))) {
        return redirect("/register");
    }
    return json({});
}

export default function RegisterSuggestionBiometric({}) {
    return (
        <Card title="Biometric auth">
            <p style={{marginTop: '15px'}}>Do you wish to enable biometric authentication? You will be able to log in without entering your login and password. You need JavaScript enabled and your browser should support this functionality. Biometric auth will be available on this device only.</p>
            <div className="card-action-block" style={{ display: 'flex', columnGap: '10px' }}>
                <a href="/" className="link-button">Skip</a>
                <a href="/register/biometric" className="link-button">Enable</a>
            </div>
        </Card>
    );
}