import PostView from "../views/community/post.view";
import { useLoaderData } from "@remix-run/react";
import { getPost } from "../models/posts.server";
import { getCategory } from "../models/categories.server";
import { json } from "@remix-run/node";
import wideCardCss from "../styles/form.wide.css";
import postCardCss from "../styles/post.card.css";
import { createVoteForPost, getMyVoteForPost, getVotesForPost } from "../models/post.votes.server";
import { getToken } from "../cookies";

export const handle = { hydrate: true };

export const links = () => [
    { rel: "stylesheet", href: wideCardCss },
    { rel: "stylesheet", href: postCardCss },
]

export const loader = async ({ request, params }) => {
    const { url, category_id, post_id } = params;

    try {
        const post = await getPost(post_id);
        const category = await getCategory(category_id);
        const { rating } = await getVotesForPost(post_id);

        const votingAvailable = (await getToken(request)) != null;
        let iVoted = false;
        let isMyVotePositive = false;
        if (votingAvailable) {
            const result = await getMyVoteForPost(request, post_id);
            if (result.i_voted) {
                iVoted = true;
                isMyVotePositive = result.is_positive;
            }
        }

        return json({
            message: null,
            post,
            category,
            url,
            rating,
            votingAvailable,
            iVoted,
            isMyVotePositive,
        });
    } catch (err) {
        console.error(err);
        return json({ error: 1, message: "Internal server error (" + err.message  + ")" }, { status: 500 });
    }
}

export const action = async ({ request, params }) => {
    const { url, category_id, post_id } = params;

    const formData = await request.formData();
    const is_positive = formData.get("is_positive") === "true";

    console.log("is_positive", is_positive);
    console.log("post_id", post_id);

    try {
        const result = await createVoteForPost(request, post_id, is_positive);
        console.log("result", result);
        return json({ message: result.success ? "Vote created": "Failed to vote" });
    } catch (err) {
        console.error(err);
        return json({ error: 2, message: "Internal server error (" + err.message  + ")" }, { status: 500 });
    }
}

export default function Post() {
    const { message, post, category, url, rating, votingAvailable, iVoted, isMyVotePositive } = useLoaderData();

    return <PostView message={message} post={post} category={category} community_url={url} rating={rating} votingAvailable={votingAvailable} iVoted={iVoted} isMyVotePositive={isMyVotePositive} />;
}