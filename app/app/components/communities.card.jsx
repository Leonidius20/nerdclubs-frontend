export default function CommunityCard({ community }) {
    const fullUrl = 'communities/' + community.url;
    return (
        <div className="community-card">
        <h2><a href={fullUrl}>{community.name}</a></h2>
        <p>{community.description}</p>
        </div>
    );
    }