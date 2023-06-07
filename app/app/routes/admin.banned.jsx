import Card from '../components/card';
import { getUserInfoOrNull } from '../cookies';
import { banUser, getAllBannedUsers, getUserById, getUserByUsername, unbanUser } from '../models/user.server';
import cardCss from '../styles/card.base.css';
import mediumCardCss from '../styles/card.medium.css';
import moderatorsListCss from '../styles/moderators.page.css';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { Form } from '@remix-run/react';

export const handle = { hydrate: true };

export const links = () => [
    { rel: 'stylesheet', href: cardCss },
    { rel: 'stylesheet', href: mediumCardCss },
    { rel: 'stylesheet', href: moderatorsListCss },
];

export const loader = async ({ request }) => {
    try {
        const bannedUsers = await getAllBannedUsers(request);
        if (bannedUsers.error) return json({ message: bannedUsers.message })
        return json({ bannedUsers });
    } catch (err) {
        return json({ message: err.message });
    }
}

export const action = async ({ request }) => {  
    const form = await request.formData();
    const action = form.get('action');
    const username = form.get('username');

    console.log(action, username);
    
    if (action === 'add') {
        try {
            console.log('start of getting by username');
            const user = await getUserByUsername(username);
            if (!user || user.error) return json({ message: user?.message || 'User not found' });
            const userId = user.user_id;
            const myUserId = (await getUserInfoOrNull(request))?.userId;

            console.log('start of banning');
            console.log(userId, myUserId);
            if (userId === myUserId) {
                return json({ message: 'You cannot ban yourself' });
            }
            await banUser(request, userId);
            return json({ message: 'User banned' });
        } catch (err) {
            return json({ message: err.message });
        }
    } else if (action === 'unban') {
        const userId = form.get('userId');
        await unbanUser(request, userId);
        return json({ message: 'User unbanned' });
    } else {
        return json({ message: 'Invalid action' })
    }
}


export default function GlobalBannedUsersPage() {
    const { message, bannedUsers } = useLoaderData();
    const feedbackMessage = useActionData()?.message;

    return (
        <Card title="Global Banned Users" backUrl={'/'} message={feedbackMessage ? feedbackMessage : message}>
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
    )
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
    )
}