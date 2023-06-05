import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getCommunity } from "../models/communities.server";
import categoryPageCss from "~/styles/category.page.css";
import stylesUrl from "~/styles/community.page.css";
import communityCardCss from "~/styles/community.card.css";
import { getUserInfoOrNull } from "../cookies";
import CommunityView from "../views/community/community.view";
import { getCategories } from "../models/categories.server";

export const meta = ({ data }) => {
    const communityName = data?.community?.name || "Community";
    const appName = process.env.APP_NAME || "";
    return [{ title: `${communityName} - ${appName}` }];
};

export const links = () => [
    { rel: "stylesheet", href: stylesUrl },
    { rel: "stylesheet", href: communityCardCss },
    { rel: "stylesheet", href: categoryPageCss },
];

export async function loader({ request, params }) {
    try {
        const community = await getCommunity(request, params.url);
        if (community.error) return json({ message: community.message });
        const id = community.id;
        const categories = await getCategories(id);

        return json({ community, categories });
    } catch (err) {
        console.log(err);
        return json({ message: "FR: " + err.message });
    }
}

export default function Community() {
    const data = useLoaderData();
    const message = data?.message;
    const community = data?.community;
    const categories = data?.categories;

    return <CommunityView message={message} community={community} categories={categories} />;
}