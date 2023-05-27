import { Outlet } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getCommunity } from "../models/communities.server";
import communityCardCss from "~/styles/community.page.css";

export const links = () => [
    { rel: "stylesheet", href: communityCardCss },
];

export async function loader({ request, params }) {
    try {
        const community = await getCommunity(request, params.url);
        if (community.error) return json({ message: community.message });
        const id = community.id;
        //const categories = await getCategories(id);

        return json({ community, /*categories*/ });
    } catch (err) {
        console.log(err);
        return json({ message: "FR: " + err.message });
    }
}

export default function CommunityParent() {
    let { community, message } = useLoaderData();

    if (!community) message = "Community not found";

    //const [communityId, setCommunityId] = useState(community.id);

    return (
        <div>
            {
                message &&
                <div id="error-message-box">
                    <p role="alert">{message}</p>
                </div>
            }
            {
                community &&
                <>
                    <div className="cover">
                        <h1>{community.name}</h1>
                        <p>{community.description}</p>
                    </div>
                    <div className="community-nav">
                        <div>
                            <a href={`/communities/${community.url}`}>Posts</a>
                            <a href={`/communities/${community.url}/wiki/main`}>Wiki</a>
                        </div>
                        <div>
                            {
                                community.is_owner && //todo: isMOderator
                                <a href={`/communities/${community.url}/addcategory`}>+ New category</a>
                            }
                        </div>
                    </div>
                    <Outlet />
                </>
            }
        </div>
    );

}