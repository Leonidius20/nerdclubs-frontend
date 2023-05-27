
import Markdown from 'markdown-to-jsx';
import { useEffect, useState } from 'react';
import Card from '../../components/card';
import ParsedDate from '../../components/date';
import OptionalErrorMessage from '../../components/optional.error.message';

export default function PostView({ message, post, category, community_url, rating, votingAvailable, iVoted, isMyVotePositive }) {
    

    return (
        <Card title={post.title} backUrl={`../`}>
            <OptionalErrorMessage message={message} />
        
            <article className='content'>
                <Markdown>{post.content}</Markdown>
            </article>
             
            
            <div>
                {/* todo author username */}
                <div className="vote-block" >
                    <form className="vote-form" method="post">
                        <input type="hidden" name="is_positive" value={true} />
                        <button type="submit" disabled={!votingAvailable || (iVoted && isMyVotePositive)} className={(iVoted && isMyVotePositive) ? "button-pressed" : ""}>&uarr;</button>
                    </form>
                    <span className={iVoted ? "rating-highlighted" : "rating"}>{rating}</span>
                    <form className="vote-form" method="post">
                        <input type="hidden" name="is_positive" value={false} />
                        <button type="submit" disabled={!votingAvailable || (iVoted && !isMyVotePositive)} className={(iVoted && !isMyVotePositive) ? "button-pressed" : ""}>&darr;</button>
                    </form>
                </div>
                
                <small><ParsedDate dateString={post.created_at}/></small>
            </div>
        </Card>
    )
}