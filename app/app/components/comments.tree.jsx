import { useState, useEffect } from "react";
import ParsedDate from "./date";

export default function CommentsTree({ comments, post_id }) {
    const [showCreateTopLevelComment, setShowCreateTopLevelComment] = useState(false);


    return (
        <div className="comments-block">
            <h2>Comments</h2>
            <button onClick={() => setShowCreateTopLevelComment(!showCreateTopLevelComment)}>
                    + Add a comment
            </button>
            {showCreateTopLevelComment && <CommentsReplyBox parent_comment_id={null} />}
            <div className="comments">
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} post_id={post_id} />
                ))}
            </div>
        </div>
    );
}

function Comment({ comment, post_id, depth = 0 }) {
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
                <div className="comment-author">&#128100; {comment.author_username}</div>
                <div className="comment-date"><ParsedDate dateString={comment.created_at}/></div>
            </div>
            <div className="comment-body">
                <div className="comment-content">{comment.content}</div>
                <div className="comment-actions">
                    <button className="comment-action" onClick={() => setShowReply(!showReply)}>
                        Reply
                    </button>
                    {/*<div className="comment-action" onClick={() => setShowReplies(!showReplies)}>
                        {showReplies ? "Hide Replies" : "Show Replies"}
                    </div>*/}
                </div>
                {showReply && <CommentsReplyBox parent_comment_id={comment.comment_id} />}
                {
                    comment.children?.map((child) => (
                        <Comment key={child.id} comment={child} post_id={post_id} depth={depth + 1}/>
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

function CommentsReplyBox({ parent_comment_id }) {
    return (
        <form method="post" className="submit-comment-reply-form">
            <input type="hidden" name="type" value="comment" />
            <input type="hidden" name="parent_comment_id" value={parent_comment_id} />
            
            <textarea
                className="comment-reply-input"
                placeholder="Write a reply..."
                name="content"
                /*value={content}
                onChange={(e) => setContent(e.target.value)}*/
            />
            <button className="comment-reply-submit" type="submit">Submit</button>
        </form>
    );
}