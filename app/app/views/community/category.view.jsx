import OptionalErrorMessage from "../../components/optional.error.message";

export default function CategoryView({ message, communityUrl, category, posts }) {
    return (
        <main>
            <OptionalErrorMessage message={message} />
            <h1>{category.name}</h1>
            <p>{category.description}</p>
            <a href={`/communities/${communityUrl}/categories/${category.id}/addpost`}>Add post</a>
            <div className="row">
                {posts.map((post) => (
                    <div key={post.id}>
                        <div className="card-body">
                            <h5 >{post.title}</h5>
                            <p>{post.content}</p>
                            <div >
                                <div className="btn-group">
                                    <a href={`/communities/${communityUrl}/categories/${category.id}/posts/${post.post_id}`} className="btn btn-sm btn-outline-secondary">View</a>
                                </div>
                                <small className="text-muted">{post.created_at}</small>
                            </div>
                        </div>
                    
                    </div>
                ))}
            </div>
        </main>
    )
}