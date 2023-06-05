import stylesUrl from "~/styles/forms.css";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { isUserFullyAuthenticated, isUserAuthenticated, is2faEnabled } from "~/cookies";
import { register } from "~/utils/auth.server";
import { getSession, commitSession } from "~/cookies";

export default function RegisterView({ errrorMessage }) {
    return (
        <main>
            <h1>Register</h1>
            <div id="error-message-box">
                {errrorMessage && <p role="alert">{errrorMessage}</p>}
            </div>
            <Form method="post">
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="Username" required />
                    <small>between 3 and 20 characters</small>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Email" required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Password" required />
                    <small>between 8 and 20 characters</small>
                </div>
                <div>
                    <label htmlFor="password2">Repeat password</label>
                    <input type="password" id="password2" name="password2" placeholder="Repeat password" required />
                </div>
                <button type="submit">Register</button>
            </Form>
        </main>
    )
}