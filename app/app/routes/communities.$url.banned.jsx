import { getUserByUsername } from '../models/user.server';
import { getCommunity } from '../models/communities.server';
import { banUserInCommunity, getUsersBannedInCommunity, unbanUserInCommunity } from '../models/community.bans.server';
import cardCss from '../styles/card.base.css';
import mediumCardCss from '../styles/card.medium.css';
import moderatorsListCss from '../styles/moderators.page.css';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import BannedUsersView from '../views/banned.users.view';
import { getUserInfoOrNull } from '../cookies';

export const handle = { hydrate: true };

export const links = () => [
    { rel: 'stylesheet', href: cardCss },
    { rel: 'stylesheet', href: mediumCardCss },
    { rel: 'stylesheet', href: moderatorsListCss },
];

export const loader = async ({ request, params }) => {
    const url = new URL(request.url);
    const pageNumber = url.searchParams.get('page') || 1;

    try {
        const communityUrl = params.url;
        const community = await getCommunity(request, communityUrl);
        const communityId = community.id;
        const bannedUsers = await getUsersBannedInCommunity(request, communityId, pageNumber);
        
        if (bannedUsers.error) return json({ message: bannedUsers.message })
        return json({ bannedUsers, pageNumber });
    } catch (err) {
        return json({ message: err.message });
    }
}

export const action = async ({ request, params }) => {  
    const form = await request.formData();
    const action = form.get('action');
    const username = form.get('username');
    
    const communityUrl = params.url;
    const community = await getCommunity(request, communityUrl);
    const communityId = community.id;
  
    if (action === 'add') {
        try {
            
            const user = await getUserByUsername(username);
            if (!user || user.error) return json({ message: user?.message || 'User not found' });
            const userId = user.user_id;
            const myUserId = (await getUserInfoOrNull(request))?.userId;

            if (userId === myUserId) {
                return json({ message: 'You cannot ban yourself' });
            }
            await banUserInCommunity(request, communityId, userId);
            return json({ message: 'User banned' });
        } catch (err) {
            return json({ message: err.message });
        }
    } else if (action === 'unban') {
        const userId = form.get('userId');
        await unbanUserInCommunity(request, communityId, userId);
        return json({ message: 'User unbanned' });
    } else {
        return json({ message: 'Invalid action' })
    }
}


export default function UsersBannedInCommunity() {
    const { message, bannedUsers, pageNumber } = useLoaderData();
    const feedbackMessage = useActionData()?.message;

    const messageToDisplay = feedbackMessage ? feedbackMessage : message;
    const backUrl = './';

    return <BannedUsersView title="Banned Users" bannedUsers={bannedUsers} messageToDisplay={messageToDisplay} backUrl={backUrl} pageNumber={pageNumber}/>;
}