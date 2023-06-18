import { Form } from '@remix-run/react';
import Card from '../components/card';
import PaginationControls from '../components/pagination.controls';

export default function BannedUsersView({ title, bannedUsers, messageToDisplay, backUrl, pageNumber }) {
    let pageCount = 1;
    if (bannedUsers && bannedUsers.length > 0) {
        pageCount = Math.ceil(bannedUsers[0].full_results_count / 10);
    }

    return (
        <Card title={title} backUrl={backUrl} message={messageToDisplay}>
            <Form method="post" className='add-moderator-form'>
                <input type="hidden" name="action" value="add" />
                <input type="text" name="username" placeholder="Username" required/>
                <button type='submit'>Add</button>
            </Form>
            {
                bannedUsers && bannedUsers.map(user => 
                    <BannedUser key={user.id} user={user} />
                )
            }
            <PaginationControls pagesCount={pageCount} currentPage={pageNumber} showLastPageButton/>
        </Card>
    );
}

function BannedUser({ user }) {
    return (
        <div className='moderator-card'>
            <p>&#128100; {user.username}</p>
            <Form method="post">
                <input type="hidden" name="action" value="unban" />
                <input type="hidden" name="userId" value={user.user_id} />
                <button type='submit'>Unban</button>
            </Form>
        </div>
    );
}