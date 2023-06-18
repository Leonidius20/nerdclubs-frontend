import { getUserInfoOrNull } from '../cookies';
import { banUser, getAllBannedUsers, getUserByUsername, unbanUser } from '../models/user.server';
import cardCss from '../styles/card.base.css';
import mediumCardCss from '../styles/card.medium.css';
import moderatorsListCss from '../styles/moderators.page.css';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import BannedUsersView from '../views/banned.users.view';

export const handle = { hydrate: true };

export const links = () => [
    { rel: 'stylesheet', href: cardCss },
    { rel: 'stylesheet', href: mediumCardCss },
    { rel: 'stylesheet', href: moderatorsListCss },
];

export const loader = async ({ request }) => {
    try {
        // get page number from url
        const url = new URL(request.url);
        const pageNumber = url.searchParams.get('page') || 1;
        const bannedUsers = await getAllBannedUsers(request, pageNumber);
        if (bannedUsers.error) return json({ message: bannedUsers.message })
        return json({ bannedUsers, pageNumber });
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
    const { message, bannedUsers, pageNumber } = useLoaderData();
    const feedbackMessage = useActionData()?.message;

    const messageToDisplay = feedbackMessage ? feedbackMessage : message;
    const backUrl = '/';

    return <BannedUsersView title="Global Banned Users" bannedUsers={bannedUsers} messageToDisplay={messageToDisplay} backUrl={backUrl} pageNumber={pageNumber} />;
}