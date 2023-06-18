export default function PaginationControls({ pagesCount, currentPage = 1, showLastPageButton = false, baseUrl = "" }) {

    const firstPageToDisplay = Math.max(1, currentPage - 2);
    const lastPageToDisplay = Math.min(pagesCount, currentPage + 2);

    const pageButtonsCount = lastPageToDisplay - firstPageToDisplay + 1;

    return (
        <div className="pagination-controls" style={{display: 'flex', justifyContent: 'space-between'}}>
            <a href={`${baseUrl}page=1`} className={1 == currentPage ? "page-button-current link-button" : "link-button"}>&lang;</a>
            <div style={{display: 'flex', columnGap: '10px'}}>
                {
                    firstPageToDisplay > 1 && <span>...</span>
                }
                
                {
                    Array.from({length: pageButtonsCount}, (v, i) => i + firstPageToDisplay).map(number => {
                        return (
                            <a
                                key={number}
                                href={`${baseUrl}page=${number}`}
                                className={number === currentPage ? "page-button-current link-button" : "link-button"}
                            >
                                {number}
                            </a>
                        );        
                    })
                }
                
                {
                    lastPageToDisplay < pagesCount && <span>...</span>
                }
            </div>
            {
                showLastPageButton ?
                <a href={`${baseUrl}page=${pagesCount}`} className={pagesCount == currentPage ? "page-button-current link-button" : "link-button"}>&rang;</a>
                :
                <div></div>
            }
        </div>
    )

}