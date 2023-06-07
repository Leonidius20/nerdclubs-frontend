//import formCss from "~/styles/form.wide.css";


import cardCss from "~/styles/card.base.css";
import cardWide from "~/styles/card.wide.css";
import formCss from "~/styles/forms.css";


import { getCommunity } from "../models/communities.server";
import { createPost } from "../models/posts.server";
import AddPostView from "../views/community/add.post.view";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";

export const handle = { hydrate: true };

export const meta = () => {
   // const appName = process?.env.APP_NAME || "";
   const appName = "";
    return [{ title: `Add post - ${appName}` }];
}

export const links = () => [
   // { rel: "stylesheet", href: formCss },
    { rel: "stylesheet", href: cardCss },
    { rel: "stylesheet", href: cardWide },
    { rel: "stylesheet", href: formCss }
];

export const loader = async ({ params }) => {
    const url = params.url;
    const categoryId = params.category_id;

    return json({
        communityUrl: url,
        categoryId,
    });
}

export const action = async ({ request, params }) => {
    // get community url from path
    //const url = params.url;
    // get category id from path
    //const categoryId = params.category_id;
    // get form data
    const form = await request.formData();
    const url = form.get("communityUrl");
    const categoryId = form.get("categoryId");
    const title = form.get("title");
    const content = form.get("content")

    

    // submit to server
    try {
        const result = await createPost(request, categoryId, title, content);

        if (!result || result.error) 
            return json({ message: result?.message || "No reponse from server" });

        
        return redirect(`/communities/${url}/categories/${categoryId}/posts/${result.post_id}`);
    } catch (error) {
        return json({ message: error.message });
    }
};

export default function AddPost() {
    const actionData = useActionData();
    const message = actionData?.message;
    
    const { communityUrl, categoryId } = useLoaderData();

    return <AddPostView message={message} communityUrl={communityUrl} categoryId={categoryId} />;

}