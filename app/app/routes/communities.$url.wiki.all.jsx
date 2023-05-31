import { getCommunity } from "../models/communities.server";
import { getAllWikiPagesInCommunity } from "../models/wiki.pages.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Card from "~/components/card.jsx";
import wideCardCss from "~/styles/form.wide.css";

export const links = () => [
    { rel: "stylesheet", href: wideCardCss },
];

export const loader = async ({ request, params }) => {
    const community_url = params.url;
    const community = await getCommunity(request, community_url);
    const community_id = community.id;

    const pages = await getAllWikiPagesInCommunity(community_id);

    return json({ community, pages });

}

export default function WikiPagesList() {
    const { community, pages } = useLoaderData();
    
    return (
        <Card title="All wiki pages">
            <ul>
                {pages.map(page => (
                    <li key={page.wiki_page_id}>
                        <a href={`/communities/${community.url}/wiki/pages/${page.url}`}>{page.title}</a>
                    </li>
                ))}
            </ul>
        </Card>
    );
}