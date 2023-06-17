import PostView from "../views/community/post.view";
import { useActionData, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { getPost, getPostWithAuth, deletePost } from "../models/posts.server";
import { getCategory } from "../models/categories.server";
import { json, redirect } from "@remix-run/node";


import cardCss from "../styles/card.base.css";
import cardWideCss from "../styles/card.wide.css";

import postCardCss from "../styles/post.card.css";
import { createVoteForPost, getMyVoteForPost, getVotesForPost } from "../models/post.votes.server";
import { getToken, getUserInfoOrNull } from "../cookies";
import { createComment, deleteComment, getCommentsForPost, getCommentsForPostWithUser } from "../models/comments.server";
import { createVoteForComment } from "../models/comment.votes.server";
import CommentsTree from "../components/comments.tree";
import { getCommunity } from "../models/communities.server";

export const handle = { hydrate: true };

export const links = () => [
    { rel: "stylesheet", href: cardCss },
    { rel: "stylesheet", href: cardWideCss },
    { rel: "stylesheet", href: postCardCss },
]

export const loader = async ({ request, params }) => {
    const { url, category_id, post_id } = params;

    try {
        // get message from url params
        const url = new URL(request.url);
        let message = url.searchParams.get("message");

        const post = await getPostWithAuth(request, post_id);
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

        
        let comments = votingAvailable ? 
            await getCommentsForPostWithUser(request, post_id) :
            await getCommentsForPost(post_id);
       
        if (comments.error) {
            message = comments.message;
            comments = [];
        }

        let isModerator = false;
        let userId = null;
        // get user id and also check if user is a moderator
        const user = await getUserInfoOrNull(request);
        if (user) {
            userId = user.userId;
        }


        return json({
            message,
            post,
            category,
            url,
            rating,
            votingAvailable,
            iVoted,
            isMyVotePositive,
            comments,
            userId,
        });
    } catch (err) {
        console.error(err);
        return json({ error: 1, message: "Internal server error (" + err.message  + ")" }, { status: 500 });
    }
}

export const action = async ({ request, params }) => {
    const { url, category_id, post_id } = params;

    const formData = await request.formData();
    
    const type = formData.get("type");
    

    if (type === "post") {
        
        try {
            const is_positive = formData.get("is_positive") === "true";
            const result = await createVoteForPost(request, post_id, is_positive);
            
            return json({ message: result.success ? "Vote created": "Failed to vote" });
        } catch (err) {
            console.error(err);
            return json({ error: 2, message: "Internal server error (" + err.message  + ")" }, { status: 500 });
        }
    } else if (type === "comment") {
        try {
            const parent_comment_id = formData.get("parent_comment_id");
            const content = formData.get("content");
            
            const result = await createComment(request, post_id, content, parent_comment_id);
            
            return json({  });
        } catch (err) {
            console.error(err);
            return json({ error: 2, message: "Internal server error (" + err.message  + ")" }, { status: 500 });
        }
    } else if (type === "comment-vote") {
        console.log("comment_vote");
        try {
            const comment_id = formData.get("item_id");
            const is_positive = formData.get("is_positive") === "true";
            console.log("comment_id", comment_id);
            console.log("is_positive", is_positive);
            const result = await createVoteForComment(request, comment_id, is_positive);
            return json({  });
        } catch (err) {
            console.error(err);
            return json({ error: 2, message: "Internal server error (" + err.message  + ")" }, { status: 500 });
        }
    } else if (type === "delete-post") {
        try {
            const result = await deletePost(request, post_id);
            return redirect(`/communities/${url}/categories/${category_id}/?message=${result.message}`);
        } catch (err) {
            return redirect(`?message=${err.message}`);
        }
    } else if (type === "delete-comment") {
        try {
            const comment_id = formData.get("comment_id");
            const res = await deleteComment(request, comment_id);
            return json({ });
        } catch (err) {
            return redirect(`?message=${err.message}`);
        }
    } else {
        return json({ error: 3, message: "Unknown action type" }, { status: 500 });
    }
}

export default function Post() {
    const { message, post, category, url, rating, votingAvailable, iVoted, isMyVotePositive, comments, userId } = useLoaderData();

    const actionMessage = useActionData()?.message;

    const messageToShow = actionMessage || message;

    // get community info from loader data
    const { community } = useRouteLoaderData('routes/communities.$url');
    const { is_owner, is_moderator } = community;

    return (
        <>
            <PostView message={messageToShow} post={post} category={category} community_url={url} rating={rating} votingAvailable={votingAvailable} iVoted={iVoted} isMyVotePositive={isMyVotePositive} isOwner={is_owner} isModerator={is_moderator}/>
            <CommentsTree comments={comments} votingAvailable={votingAvailable} isViewerModerator={is_moderator} viewerUserId={userId} />
        </>
    );
}