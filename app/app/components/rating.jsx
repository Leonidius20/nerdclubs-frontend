export default function Rating({ type, itemId, rating, votingAvailable, iVoted, isMyVotePositive}) {
    return(
        <div className="vote-block" >
            <form className="vote-form" method="post">
                <input type="hidden" name="is_positive" value={true} />
                <input type="hidden" name="type" value={type} />
                <input type="hidden" name="item_id" value={itemId} />
                <button type="submit" disabled={!votingAvailable || (iVoted && isMyVotePositive)} className={(iVoted && isMyVotePositive) ? "button-pressed" : ""}>&uarr;</button>
            </form>
            <span className={iVoted ? "rating-highlighted" : "rating"}>{rating}</span>
            <form className="vote-form" method="post">
                <input type="hidden" name="is_positive" value={false} />
                <input type="hidden" name="type" value={type} />
                <input type="hidden" name="item_id" value={itemId} />
                <button type="submit" disabled={!votingAvailable || (iVoted && !isMyVotePositive)} className={(iVoted && !isMyVotePositive) ? "button-pressed" : ""}>&darr;</button>
            </form>
        </div>
    );
}