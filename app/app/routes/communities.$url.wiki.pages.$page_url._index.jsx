import wideCardCss from '~/styles/form.wide.css';
import wikiPageCss from '~/styles/wiki.page.css';
import Card from '~/components/card.jsx';
import { getCommunity } from '../models/communities.server';
import { getWikiPageByUrl } from '../models/wiki.pages.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Markdown from 'markdown-to-jsx';
import List from '../components/list';

export const links = () => [
    { rel: "stylesheet", href: wideCardCss },
    { rel: "stylesheet", href: wikiPageCss },
]

export const loader = async ({ request, params }) => {
    const community_url = params.url;
    const page_url = params.page_url;

    // get community id
    const community = await getCommunity(request, community_url);
    const community_id = community.id;

    // get page
    const page = await getWikiPageByUrl(community_id, page_url);
    if (!page) {
        return json({ message: "Page not found", community_url, page_url }, { status: 404 });
    }
    if (page.error) {
        if (page.message == 'Not found') {
            return json({ not_found: true, community_url, page_url }, { status: 404 });
        } else {
            return json({ message: page.message, community_url, page_url }, { status: 500 });
        }
    }

    return json({ page, community_url, page_url });
}

export default function WikiPage() {
    const { message, not_found, page, community_url, page_url } = useLoaderData();

    if (not_found) {
        return (
            <Card title="Page not found">
                <p>Page with such url doesn't exist in this community. </p>
                <a href={`/communities/${community_url}/create-wiki-page?url=${page_url}`} className='link-button' style={{margin: 'auto', marginTop: '15px'}}>Create</a>
            </Card>
        );
    }

    return (
        <div className='wiki-page-body'>
        
            <Card title={page.title} message={message}>
                <article className='content'>
                    <Markdown>{page.content}</Markdown>
                </article>
            </Card>
            <aside>
                <h3>This page</h3>
                <ul>
                    <li>
                        <a href={`/communities/${community_url}/wiki/pages/${page_url}/edit`}>Edit</a>
                    </li>
                </ul>
                <h3>Other pages</h3>
                <ul>
                    <li>
                        <a href={`/communities/${community_url}/wiki/create`}>Create new</a>
                    </li>
                    <li>
                        <a href={`/communities/${community_url}/wiki/all`}>List all pages</a>
                    </li>
                </ul>
            </aside>
        </div>
    );
}