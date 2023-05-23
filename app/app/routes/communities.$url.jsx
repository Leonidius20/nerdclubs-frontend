import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getCommunity } from "../models/communities.server";

import stylesUrl from "~/styles/community.page.css";
import { getUserInfoOrNull } from "../cookies";

export const meta = ({ data }) => {
    const communityName = data?.community?.name || "Community";
    const appName = process.env.APP_NAME || "";
    return [{ title: `${communityName} - ${appName}` }];
};

export const links = () => [
    { rel: "stylesheet", href: stylesUrl },
];

export async function loader({ request, params }) {
    try {
        const community = await getCommunity(request, params.url);
        if (community.error) return json({ message: community.message });

        return json({ community });
    } catch (err) {
        console.log(err);
        return json({ message: "FR: " + err.message });
    }
}

export default function Community() {
    const data = useLoaderData();

    return (
        <div>
            {
                data?.message &&
                <div id="error-message-box">
                    <p role="alert">{data.message}</p>
                </div>
            }
            {
                data?.community &&
                <>
                    <div class="cover">
                        <h1>{data.community.name}</h1>
                        <p>{data.community.description}</p>
                        {
                            data.community.is_owner && //todo: isMOderator
                            <a href={`/communities/${data.community.url}/addcategory`}>Add category</a>
                        }
                    </div>
                    <main>
                        <h2>Post categories</h2>
                    </main>
                </>
            }
        </div>
    );
}