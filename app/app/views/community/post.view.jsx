import { Form } from '@remix-run/react';
import Markdown from 'markdown-to-jsx';
import { useEffect, useState } from 'react';
import Card from '../../components/card';
import ParsedDate from '../../components/date';
import OptionalErrorMessage from '../../components/optional.error.message';
import Rating from '../../components/rating';

export default function PostView({ message, post, category, community_url, rating, votingAvailable, iVoted, isMyVotePositive, isOwner = false, isModerator = false }) {
    

    return (
        <Card title={post.title} backUrl={`../`} message={message}>
        
            <article className='content'>
                <Markdown>{post.content}</Markdown>
            </article>
             
            
            <div className="comment-actions" style={{marginBottom: '15px'}}>
                {/* todo author username */}
                <div style={{display: 'flex', columnGap: '10px'}}>
                    <Rating type="post" itemId={post.id} rating={rating} votingAvailable={votingAvailable} iVoted={iVoted} isMyVotePositive={isMyVotePositive} />
                    {
                        (isOwner || isModerator) &&
                        <Form method="POST">
                            <input type="hidden" name="type" value="delete-post" />
                            <input type="hidden" name="post_id" value={post.id} />
                            <button type="submit">&#128465;</button>
                        </Form>
                    }
                </div>
                
                <div style={{display: 'flex', columnGap: '10px'}}>
                    <span>{post.username} <ParsedDate dateString={post.created_at}/></span>
                    
                </div>
            </div>
        </Card>
    )
}