import { redirect } from "@remix-run/node";
import { getCommunity } from "../models/communities.server";
import { unsubscribeFromCommunity } from "../models/subscriptions.server"

export const loader = async ({ request, params }) => {
    const url = params.url;
    const community = await getCommunity(request, url);
    if (community.is_subscribed) {
        await unsubscribeFromCommunity(request, community.id);
    }
    return redirect(`/communities/${url}`);
}