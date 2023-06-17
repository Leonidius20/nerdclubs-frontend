import { Form } from '@remix-run/react';
import Card from '../components/card';

export default function BannedUsersView({ title, bannedUsers, messageToDisplay, backUrl }) {
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