import stylesUrl from "~/styles/forms.css";
import { getToken } from "../cookies";
import { createCommunity } from "../models/communities.server";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";


export const meta = () => {
    return [{ title: `Create Community - ${process.env.APP_NAME}` }];
};

export const links = () => [
    { rel: "stylesheet", href: stylesUrl },
]

export const action = async ({ request }) => {
    const form = await request.formData();
    const name = form.get("name");
    const url = form.get("url");

    if (!name || !url) {
        return json({ message: "Invalid input format" }, { status: 400 });
    }

    if (!/^[A-Za-z0-9]*$/.test(url)) { // there are non-english or special chars in url
        return json({ message: "URL should contain only English letters and numbers" }, { status: 400 });
    }

    const description = form.get("description");

    try {
        const res = await createCommunity(request, name, description, url);
        if (res.error) {
            return json({ message: res.message });
        }
        return redirect(`/communities/${url}`);
    } catch (err) {
        console.log(err);
        return json({ message: "FR: " + err.message });
    }
}

export default function createCommunityController() {
    const actionData = useActionData();

    return (
        <main>
            <h1>Create community</h1>
            {
                actionData?.message && 
                <div id="error-message-box">
                    <p role="alert">{actionData.message}</p>
                </div>
            }
            <form method="post">
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" required />
                </div>
                <div>
                    <label htmlFor="url">URL</label>
                    <input type="text" name="url" id="url" required />
                    <small>Fragment of the community's URL</small>
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea name="description" id="description" />
                    <small>Optional</small>
                </div>
                <button type="submit">Create</button>
            </form>
        </main>
    )
}