export default function CommunityView({ message, community, categories }) {
    if (!community) message = "Community not found";
    if (!categories) {
        message = "Categories not found";
        categories = [];
    }


    return ( 
        <main>
            
            <div className="category-header">
                <div>
                    <h2>Post categories</h2>
                </div>
                {
                    community.is_moderator &&
                    <div>
                        <a href={`/communities/${community.url}/addcategory`}  className="link-button">+ Add category</a>
                    </div>
                }
            </div>
            {categories.map(category => (
                <div className="category community-card" key={category}>
                    <a href={`/communities/${community.url}/categories/${category.id}`}>
                        <h3>{category.name}</h3>
                    </a>
                    
                    <p>{category.description}</p>
                    
                </div>
            ))}
        </main>
    );
}