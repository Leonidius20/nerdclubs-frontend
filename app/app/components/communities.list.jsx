import CommunityCard from "./communities.card";

export default function CommunitiesList({ communities }) {
  return (
    <div className="communities-list">
      {communities.map(community => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </div>
  );
}

