import { json } from "@remix-run/node";
import { getPostsFromSubscriptions } from "../models/subscriptions.server";
import { useLoaderData } from "@remix-run/react";
import communityCardCss from "~/styles/community.card.css";
import categoryPageCss from "~/styles/category.page.css";
import markdownToTxt from 'markdown-to-txt';
import ParsedDate from "../components/date";
import PaginationControls from "../components/pagination.controls";

export const handle = { hydrate: true };

export const links = () => [
    { rel: "stylesheet", href: communityCardCss },
    { rel: "stylesheet", href: categoryPageCss },
];


export const loader = async ({ request, params }) => {
    // get page number from query string
    const url = new URL(request.url);
    const pageNumber = url.searchParams.get('page') || 1;

    const posts = await getPostsFromSubscriptions(request, pageNumber);
    return json({ posts, pageNumber });
}

export default function Subscriptions() {
    const { posts, pageNumber } = useLoaderData();

    let pageCount = 1;
    if (posts && posts.length > 0) {
        pageCount = Math.ceil(posts[0].full_results_count / 10);
    }

    return (
        <main style={{maxWidth: '600px', margin: 'auto'}}>
            <h1>Subscriptions</h1>
            {posts.map((post) => {
                const content = markdownToTxt(post.content);
                const initialLength = content.length;
                const maxLength = 1000;
                const truncatedContent = content.slice(0, maxLength);
                const truncated = initialLength > maxLength;

                return(
                <div key={post} className="community-card">
                    
                    <a href={`/communities/${post.url}/categories/${post.category_id}/posts/${post.post_id}`}>
                        <h3>{post.title}</h3>
                    </a>
                    <div className="post-card-main-content">
                        <p>{truncatedContent}</p>
                        {truncated && <div className="fade-overlay"></div>}
                    </div>
                        
                        <div >
                            <small><ParsedDate dateString={post.created_at} /> in {post.community_name}</small>
                        </div>
                    
                
                </div>);
            })}
            {
                posts && posts.length > 0 &&
                <PaginationControls pagesCount={pageCount} currentPage={pageNumber} showLastPageButton style={{marginBottom: "20px"}}/>
            }
        </main>
    );
}