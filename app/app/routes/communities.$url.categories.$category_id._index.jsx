import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import CategoryView from "../views/community/category.view";
import { getCategory } from "../models/categories.server";
import { json } from "@remix-run/node";
import { getPostsInCategory } from "../models/posts.server";
import communityCardCss from "~/styles/community.card.css";
import categoryPageCss from "~/styles/category.page.css";
import { isUserAuthenticated } from "../cookies";

export const links = () => [
    { rel: "stylesheet", href: communityCardCss },
    { rel: "stylesheet", href: categoryPageCss },
];

export const loader = async ({ request, params }) => {
    const communityUrl = params.url;
    const categoryId = params.category_id;

    const isUserLoggedIn = await isUserAuthenticated(request);
    
    try {
        // get category from server
        const category = await getCategory(categoryId);

        // get posts from server
        const posts = await getPostsInCategory(categoryId);

        return json({
            communityUrl,
            category, posts,
            isUserLoggedIn,
        });
    } catch (error) {
        return json({ message: error.message });
    }

}

export default function Category() {
    const { message, communityUrl, category, posts, isUserLoggedIn } = useLoaderData(); 

    const { community } = useRouteLoaderData('routes/communities.$url');
    const { is_owner, is_moderator } = community;

    return <CategoryView message={message} communityUrl={communityUrl} category={category} posts={posts} isUserLoggedIn={isUserLoggedIn} isUserModerator={community.is_moderator} />
}