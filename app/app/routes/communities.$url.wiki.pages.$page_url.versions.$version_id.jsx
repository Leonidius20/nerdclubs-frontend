import { json } from "@remix-run/node";
import WikiPageView from "../views/community/wiki.page.view";
import { getWikiPageVersionById } from "../models/wiki.page.versions.server";
import { useLoaderData } from "@remix-run/react";
import Card from "../components/card";
import Markdown from "markdown-to-jsx";
import ParsedDate from "../components/date";
import cardCss from "~/styles/card.base.css";
import wideCardCss from '~/styles/card.wide.css';
import wikiPageCss from '~/styles/wiki.page.css';

export const links = () => [
    { rel: "stylesheet", href: wideCardCss },
    { rel: "stylesheet", href: cardCss },
    // { rel: "stylesheet", href: wikiPageCss },
];

export async function loader({ request, params }) {
    const { url, page_url, version_id } = params;

    try {
        const version = await getWikiPageVersionById(version_id);
        return json({ version });
    } catch (err) {
        return json({ message: err.message });
    }
}

export default function WikiPageVersion() {
    const { version, message } = useLoaderData();

    return (
        <Card title={version.title} message={message} backUrl='./'>
            <article className='content' style={{marginBottom: '20px'}}>
                <Markdown>{version.content}</Markdown>
            </article>
            <small>Last edited: <ParsedDate dateString={version.last_modified}/> by {version.last_editor_username}</small>
        </Card>
    );
}