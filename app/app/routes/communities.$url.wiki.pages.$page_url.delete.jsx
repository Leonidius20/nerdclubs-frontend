import { redirect } from "@remix-run/node";
import { getCommunity } from "../models/communities.server";
import { deleteWikiPage, getWikiPageByUrl } from "../models/wiki.pages.server";

export async function loader({ request, params }) {
    const { url, page_url } = params;
    try {
        const community = await getCommunity(request, url);
        const page = await getWikiPageByUrl(community.community_id, page_url);
        await deleteWikiPage(request, community.community_id, page.wiki_page_id);
        return redirect(`/communities/${url}/wiki/pages/main`);
    } catch (err) {
        console.log(err);
        return json({ message: "FR: " + err.message });
    }
}

export default function WikiPageDelete() {
    return (
        <div className='card'>
            <h2>Delete Wiki Page</h2>
            <p>TODO: Implement</p>
        </div>
    );
}