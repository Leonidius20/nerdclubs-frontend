import AddCategoryView from "../views/community/add.category.view";
import formCss from "~/styles/forms.css";
import { useActionData, useMatches } from "@remix-run/react";  
import { createCategory } from "../models/categories.server";
import { getCommunity } from "../models/communities.server";
import { redirect } from "@remix-run/node";

export const meta = () => {
    const appName = process.env.APP_NAME || "";
    return [{ title: `Add category - ${appName}` }];
};

export const links = () => [
    { rel: "stylesheet", href: formCss },
];

export const action = async ({ request, params }) => {
    // get community url from path
    const url = params.url;
    // get form data
    const form = await request.formData();
    const name = form.get("name");
    const description = form.get("description");

    
    // submit to server
    try {
        // get community id from serve
        const community = await getCommunity(request, url);
        const communityId = community.id;

        const result = await createCategory(request, communityId, name, description);
        return redirect(`/communities/${url}/categories/${result.id}`);
    } catch (error) {
        return json({ message: error.message }, 500);
    }
};

export default function AddCategory() {
    const actionData = useActionData();
    const message = actionData?.message;

    return <AddCategoryView message={message}/>;
}