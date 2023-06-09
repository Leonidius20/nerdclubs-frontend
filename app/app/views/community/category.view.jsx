import OptionalErrorMessage from "../../components/optional.error.message";
import ParsedDate from "../../components/date";
import markdownToTxt from 'markdown-to-txt';
import PaginationControls from "../../components/pagination.controls";

export default function CategoryView({ message, communityUrl, category, posts, isUserLoggedIn, isUserModerator, currentPage }) {

    let pageCount = 1;
    if (posts && posts.length > 0) {
        pageCount = Math.ceil(posts[0].full_results_count / 10);
    }

    return (
        <main>
            <OptionalErrorMessage message={message} />
            <div className="category-header">
                <div>
                    <h2>{category.name}</h2>
                    <p>{category.description}</p>
                </div>
                <div style={{display: 'flex', columnGap: '15px'}}>
                    {
                        isUserModerator &&
                        <a href={`/communities/${communityUrl}/categories/${category.id}/delete`} className="link-button">Delete category</a>
                    }
                    {
                        isUserLoggedIn &&
                        <a href={`/communities/${communityUrl}/categories/${category.id}/addpost`}  className="link-button">+ Add post</a>
                        
                    }
                </div>
                
            </div>
            
            
            <div>
                {posts.map((post) => {
                    const content = markdownToTxt(post.content);
                    const initialLength = content.length;
                    const maxLength = 1000;
                    const truncatedContent = content.slice(0, maxLength);
                    const truncated = initialLength > maxLength;

                    return(
                    <div key={post} className="community-card">
                        
                        <a href={`/communities/${communityUrl}/categories/${category.id}/posts/${post.post_id}`}>
                            <h3>{post.title}</h3>
                        </a>
                        <div className="post-card-main-content">
                            <p>{truncatedContent}</p>
                            {truncated && <div className="fade-overlay"></div>}
                        </div>
                            
                            <div >
                                <small><ParsedDate dateString={post.created_at} /></small>
                            </div>
                        
                    
                    </div>);
                })}
            </div>
            {
                !posts || posts.length === 0 &&
                <p style={{marginTop: "30px"}}>There are no posts in this category. You can add one by pressing + Add post.</p>
            }
            {
                posts && posts.length > 0 &&
                <PaginationControls pagesCount={pageCount} currentPage={currentPage} showLastPageButton style={{marginBottom: "20px"}}/>
            }
        </main>
    )
}