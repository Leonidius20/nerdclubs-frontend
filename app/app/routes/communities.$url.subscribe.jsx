import { redirect } from "@remix-run/node";
import { getCommunity } from "../models/communities.server";
import { subscribeToCommunity } from "../models/subscriptions.server"

export const loader = async ({ request, params }) => {
    const url = params.url;
    const community = await getCommunity(request, url);
    if (!community.is_subscribed) {
        await subscribeToCommunity(request, community.id);
    }
    return redirect(`/communities/${url}`);
}