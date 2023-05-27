export default function CommunityView({ message, community, categories }) {
    if (!community) message = "Community not found";
    if (!categories) {
        message = "Categories not found";
        categories = [];
    }


    return ( 
        <main>
            <h2>Post categories</h2>
            {categories.map(category => (
                <div class="category community-card" key={category}>
                    <a href={`/communities/${community.url}/categories/${category.id}`}>
                        <h3>{category.name}</h3>
                    </a>
                    
                    <p>{category.description}</p>
                    
                </div>
            ))}
        </main>
    );
}