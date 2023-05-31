import { json, redirect } from '@remix-run/node';
import { getCommunity } from '~/models/communities.server.jsx';
import { getWikiPageVersions } from '~/models/wiki.page.versions.server.jsx';
import { getWikiPageByUrl } from '~/models/wiki.pages.server.jsx';
import { useLoaderData, Form } from '@remix-run/react';
import stylesUrl from "~/styles/community.page.css";
import communityCardCss from "~/styles/community.card.css";
import ParsedDate from '~/components/date.jsx';
import { rollbackTo } from '../models/wiki.page.versions.server';

export const links = () => [
    { rel: "stylesheet", href: stylesUrl },
    { rel: "stylesheet", href: communityCardCss },
];

export const loader = async ({ request, params }) => {
    const community_url = params.url;
    const page_url = params.page_url;

    const community = await getCommunity(request, community_url);
    const wikiPage = await getWikiPageByUrl(community.id, page_url);

    const wikiPageVersions = await getWikiPageVersions(wikiPage.wiki_page_id);
    if (wikiPageVersions.length > 0) wikiPageVersions[0].freshest = true;

    return json({
        community,
        wikiPage,
        wikiPageVersions,
    });
};

export const action = async ({ request, params }) => {
    const community_url = params.url;
    const page_url = params.page_url;

    const community = await getCommunity(request, community_url);
    const community_id = community.id;

    const form = await request.formData();
    const wiki_page_version_id = form.get('wiki_page_version_id');

    const result = await rollbackTo(request, community_id, wiki_page_version_id);

    if (!result || result.error) {
        return redirect(`?message=${result ? result.message : 'Unknown error'}`)
    }

    return redirect(`/communities/${community_url}/wiki/pages/${page_url}`);
};

export default function WikiPageVersions() {
    const { community, wikiPage, wikiPageVersions } = useLoaderData();

    return (
        <main>
        <h2>Page versions</h2>
        {wikiPageVersions.map(version => (
            <div class="category community-card" key={version} style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                    <a href={`versions/${version.wiki_page_version_id}`}>
                        <h3><ParsedDate dateString={version.last_modified}/> ({version.title})</h3>
                    </a>
                    <p>Modified by: {version.last_editor_username}</p>
                </div>
                <div>
                    {
                        (community.is_moderator && !version.freshest) &&
                        <Form method="post">
                            <input type="hidden" name="wiki_page_version_id" value={version.wiki_page_version_id}/>
                            <button type='submit'>Restore</button>
                        </Form>
                    }
                </div>
                
            </div>
        ))}
    </main>
    );
}