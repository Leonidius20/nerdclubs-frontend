import { Outlet } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getCommunity } from "../models/communities.server";
import communityCardCss from "~/styles/community.page.css";
import { getUserInfoOrNull } from "../cookies";
import Card from "../components/card";
import { getUserDataByToken } from "../models/user.server";

export const links = () => [
    { rel: "stylesheet", href: communityCardCss },
];

export async function loader({ request, params }) {
    try {
        const community = await getCommunity(request, params.url);
        if (community.error) return json({ message: community.message });
        const id = community.id;
        
        // get user

        const user = await getUserDataByToken(request);
        const isSiteAdmin = user?.privilege_level === 2;

        return json({ community, isSiteAdmin });
    } catch (err) {
        console.log(err);
        return json({ message: "FR: " + err.message });
    }
}

export default function CommunityParent() {
    let { community, message, isSiteAdmin } = useLoaderData();

    if (!community) message = "Community not found";

    //const [communityId, setCommunityId] = useState(community.id);

    if (community.is_banned) {
        return (
            <Card title="Banned">
                <p>You are banned from this community.</p>
            </Card>
        );
    }

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
                            <a href={`/communities/${community.url}/wiki/pages/main`}>Wiki</a>
                        </div>
                        <div>
                            <a href={`/communities/${community.url}/moderators`}>Moderators</a>
                            
                            {
                                community.is_moderator &&
                                <a href={`/communities/${community.url}/banned`}>Banned users</a>
                            }
                            {
                                isSiteAdmin &&
                                <a href={`/communities/${community.url}/delete`}>Delete group</a>
                            }
                        </div>
                    </div>
                    <Outlet />
                </>
            }
        </div>
    );

}