import formCss from "~/styles/forms.css";
import { getCommunity } from "../models/communities.server";
import { createPost } from "../models/posts.server";
import AddPostView from "../views/community/add.post";
import { json, redirect } from "@remix-run/node";

export const meta = () => {
    const appName = process.env.APP_NAME || "";
    return [{ title: `Add post - ${appName}` }];
}

export const links = () => [
    { rel: "stylesheet", href: formCss },
];

export const action = async ({ request, params }) => {
    // get community url from path
    const url = params.url;
    // get category id from path
    const categoryId = params.category_id;
    // get form data
    const form = await request.formData();
    const title = form.get("title");
    const content = form.get("content");

    // submit to server
    try {
        const result = await createPost(request, categoryId, title, content);
        return redirect(`/communities/${url}/categories/${categoryId}/posts/${result.post_id}`);
    } catch (error) {
        return json({ message: error.message }, 500);
    }
};

export default function AddPost() {
    return <AddPostView />;

}