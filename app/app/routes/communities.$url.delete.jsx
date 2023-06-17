import Card from "../components/card";
import cardCss from "~/styles/card.base.css";
import cardNarrowCss from "~/styles/card.narrow.css";
import formCss from "~/styles/forms.css";
import { Form, useActionData } from "@remix-run/react";
import { useRouteLoaderData } from "@remix-run/react"; 
import { deleteCommunity } from "../models/communities.server";
import { json, redirect } from "@remix-run/node";

export const links = () => [
    { rel: "stylesheet", href: cardCss },
    { rel: "stylesheet", href: cardNarrowCss },
    { rel: "stylesheet", href: formCss },
];

export const action = async ({ request }) => {
    const form = await request.formData();
    const community_id = form.get('community_id');
    try {
        await deleteCommunity(request, community_id);
        return redirect('/');
    }
    catch (err) {
        return json({ message: err.message });
    }
};

export default function CommuityDeleteConfirmationPage() {
    // get community id from other route
    const { community } = useRouteLoaderData('routes/communities.$url');
    const { community_id } = community;

    const message = useActionData()?.message;

    return (
        <Card title="Delete community" backUrl="./" message={message}>
            <p style={{marginTop: '15px', textAlign: 'justify'}}>Do you wish to delete this community? This action is irreversible. All posts, comments, wiki pages and any other content associated with this community will be permanently lost.</p>
            <div className="card-action-block" style={{ display: 'flex', columnGap: '10px' }}>
                <Form method="post" style={{display: 'inline-block'}}>
                    <input type="hidden" name="community_id" value={community_id}/>
                    <button type="submit" className="main-action-button link-button" style={{margin: '0', width: '100%'}}>Delete</button>
                </Form>
            </div>
        </Card>
    );
}