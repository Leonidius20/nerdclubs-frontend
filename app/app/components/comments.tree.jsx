import { useState, useEffect } from "react";
import ParsedDate from "./date";
import Rating from "./rating";
import { Form } from "@remix-run/react";

export default function CommentsTree({ comments, post_id, votingAvailable }) {
    const [showCreateTopLevelComment, setShowCreateTopLevelComment] = useState(false);


    return (
        <div className="comments-block">
            <h2>Comments</h2>
            {
                votingAvailable ?
                <button onClick={() => setShowCreateTopLevelComment(!showCreateTopLevelComment)}>
                    + Add a comment
                </button> :
                <p>Log in to add a comment or rate other comments.</p>
            }
            
            {showCreateTopLevelComment && <CommentsReplyBox parent_comment_id={null} onSubmit={() => {setShowCreateTopLevelComment(false)}} />}
            <div className="comments">
                {comments.map((comment) => (
                    <Comment key={comment} comment={comment} post_id={post_id} rating={comment.rating} iVoted={comment.i_voted} isMyVotePositive={comment.is_my_vote_positive} votingAvailable={votingAvailable} />
                ))}
            </div>
        </div>
    );
}

function Comment({ comment, post_id, depth = 0, rating, iVoted, isMyVotePositive, votingAvailable }) {
    //const [content, setContent] = useState("");
    const [showReply, setShowReply] = useState(false);
    //const [showReplies, setShowReplies] = useState(false);
   // const [replies, setReplies] = useState([]);

    /*useEffect(() => {
        if (showReplies) {
            getCommentsForPost(post_id).then((res) => {
                setReplies(res.comments);
            });
        }
    }, [showReplies]);*/

    const handleSubmit = (e) => {
        e.preventDefault();
        createComment(post_id, content, comment.id).then((res) => {
            if (res.success) {
                setShowReply(false);
                setContent("");
            }
        });
    };

    const style = {
        marginLeft: `${depth * 20}px`,
    }

    return (
        <div className="comment" style={style}>
            <div className="comment-header">
                <div className="comment-author">&#128100; {comment.username}</div>
                <div className="comment-date"><ParsedDate dateString={comment.created_at}/></div>
            </div>
            <div className="comment-body">
                <div className="comment-content">{comment.content}</div>
                <div className="comment-actions">
                    <Rating type="comment-vote" itemId={comment.comment_id} rating={rating} votingAvailable={votingAvailable} iVoted={iVoted} isMyVotePositive={isMyVotePositive}/> 
                    {
                        votingAvailable &&
                        <button className="comment-action" onClick={() => setShowReply(!showReply)}>
                            Reply
                        </button>
                    }
                    {/*<div className="comment-action" onClick={() => setShowReplies(!showReplies)}>
                        {showReplies ? "Hide Replies" : "Show Replies"}
                    </div>*/}
                </div>
                {showReply && <CommentsReplyBox parent_comment_id={comment.comment_id} onSubmit={() => {setShowReply(false)}}/>}
                {
                    comment.children?.map((child) => (
                        <Comment key={child} comment={child} post_id={post_id} depth={depth + 1} rating={child.rating} iVoted={child.i_voted} isMyVotePositive={child.is_my_vote_positive} votingAvailable={votingAvailable}/>
                    ))
                }
            </div>
            
            {/*showReplies && (
                <div className="comment-replies">
                    {replies.map((reply) => (
                        <Comment key={reply.id} comment={reply} post_id={post_id} />
                    ))}
                </div>
            )*/}
        </div>
    );
}

function CommentsReplyBox({ parent_comment_id, onSubmit }) {
    return (
        <Form method="post" className="submit-comment-reply-form" onSubmit={onSubmit}>
            <input type="hidden" name="type" value="comment"/>
            <input type="hidden" name="parent_comment_id" value={parent_comment_id} />
            
            <textarea
                className="comment-reply-input"
                placeholder="Write a reply..."
                name="content"
                required
                /*value={content}
                onChange={(e) => setContent(e.target.value)}*/
            />
            <button className="comment-reply-submit" type="submit">Submit</button>
        </Form>
    );
}