import CommunityCard from "./communities.card";
import PaginationControls from "./pagination.controls";

export default function CommunitiesList({ communities, pageNumber = 1, pagesCount = 1, baseUrl = "" }) {
  // todo: what is the page count?


  return (
    <div className="communities-list">
      {communities.map(community => (
        <CommunityCard key={community} community={community} />
      ))}
      <PaginationControls pagesCount={pagesCount} currentPage={pageNumber} showLastPageButton baseUrl={baseUrl} />
    </div>
  );
}

