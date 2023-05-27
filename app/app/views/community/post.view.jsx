
import Markdown from 'markdown-to-jsx';
import { useEffect, useState } from 'react';
import Card from '../../components/card';
import ParsedDate from '../../components/date';
import OptionalErrorMessage from '../../components/optional.error.message';
import Rating from '../../components/rating';

export default function PostView({ message, post, category, community_url, rating, votingAvailable, iVoted, isMyVotePositive }) {
    

    return (
        <Card title={post.title} backUrl={`../`}>
            <OptionalErrorMessage message={message} />
        
            <article className='content'>
                <Markdown>{post.content}</Markdown>
            </article>
             
            
            <div className="comment-actions" style={{marginBottom: '15px'}}>
                {/* todo author username */}
                <Rating type="post" itemId={post.id} rating={rating} votingAvailable={votingAvailable} iVoted={iVoted} isMyVotePositive={isMyVotePositive} />
                
                <span>{post.username} <ParsedDate dateString={post.created_at}/></span>
            </div>
        </Card>
    )
}