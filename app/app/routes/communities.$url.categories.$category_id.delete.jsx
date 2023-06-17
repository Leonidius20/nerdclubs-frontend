import deleteCategory from "../models/categories.server";
import { getCommunity } from "../models/communities.server";
import { redirect, json } from "@remix-run/node";

export const loader = async ({ request, params }) => {
    const { url, category_id } = params;
    try {
        const community = await getCommunity(request, url);
        const community_id = community.community_id;
        await deleteCategory(request, community_id, category_id);
        return redirect(`/communities/${url}/`);
    } catch (err) {
        console.log(err);
        return json({ message: "FR: " + err.message });
    }  
};