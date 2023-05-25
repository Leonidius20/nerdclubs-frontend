export default function CommunityView({ message, community, categories }) {
    if (!community) message = "Community not found";
    if (!categories) {
        message = "Categories not found";
        categories = [];
    }


    return (
        <div>
            {
                message &&
                <div id="error-message-box">
                    <p role="alert">{message}</p>
                </div>
            }
            {
                community &&
                <>
                    <div class="cover">
                        <h1>{community.name}</h1>
                        <p>{community.description}</p>
                        {
                            community.is_owner && //todo: isMOderator
                            <a href={`/communities/${community.url}/addcategory`}>Add category</a>
                        }
                    </div>
                    <main>
                        <h2>Post categories</h2>
                        {categories.map(category => (
                            <div class="category" key={category}>
                                <h3>{category.name}</h3>
                                <p>{category.description}</p>
                                <a href={`/communities/${community.url}/categories/${category.id}`}>View posts</a>
                            </div>
                        ))}
                    </main>
                </>
            }
        </div>
    );
}