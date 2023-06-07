import { getCommunity } from "../models/communities.server";
import { getUserById, getUserByUsername } from "../models/user.server";
import OptionalErrorMessage from "../components/optional.error.message";
import { Form, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import moderatorsPageCss from "../styles/moderators.page.css";
import { addModerator, getModeratorsByCommunityUrl, makeOwner, removeModerator } from "../models/moderators.server";
import { getUserInfoOrNull } from "../cookies";

export function links() {
    return [
        { rel: "stylesheet", href: moderatorsPageCss },
    ];
}

export const loader = async ({ request, params }) => {
    try {
        const url = new URL(request.url);
        const message = url.searchParams.get("message");

        const community_url = params.url;
        const community = await getCommunity(request, community_url);
        const community_id = community.id;
        const owner_user_id = community.owner_user_id;

        // get info about the owner
        const owner = await getUserById(owner_user_id);

        // get moderators
        const moderators = await getModeratorsByCommunityUrl(community_url);

        if (moderators.error) {
            return json({ message: moderators.message });
        }

        // check if current user is the owner
        const currentUserInfo = await getUserInfoOrNull(request);
        const is_owner = currentUserInfo && currentUserInfo.userId === owner_user_id;

        return json({
            message,
            owner,
            moderators: moderators.moderators,
            is_owner,
        });
    } catch (err) {
        console.log(err);
        return json({ message: "Error: " + err.message });
    }
}

export const action = async ({ request, params }) => {
    const redirectUrl = `/communities/${params.url}/moderators?message=`;
   
    try {
        
        const formData = await request.formData();
       
        const action = formData.get("action");
        

        if (action === 'add') {
           
            const username = formData.get("username");
            
            const userInfo = await getUserByUsername(username);
           
            if (!userInfo || userInfo.error) {
                
                //return json({ message: "User not found" });
                return redirect(`${redirectUrl}User not found`);
            }
            const user_id = userInfo.user_id;

            const community_url = params.url;
            const community = await getCommunity(request, community_url);
            const community_id = community.id;

            const result = await addModerator(request, community_id, user_id);

            if (!result) {
                return redirect(`${redirectUrl}Error adding moderator`);
            }

            if (result.error) {
                return redirect(`${redirectUrl}${result.message}`);
            }

            return redirect(`${redirectUrl}Moderator added`);
        } else if (action === 'remove') {
            const userId = formData.get("moderator_id");

            const community_url = params.url;
            const community = await getCommunity(request, community_url);
            const community_id = community.id;

            console.log("community_id", community_id);
            console.log("userId", userId);

            const result = await removeModerator(request, community_id, userId);

            if (!result) {
                return redirect(`${redirectUrl}Error removing moderator`);
            }

            if (result.error) {
                return redirect(`${redirectUrl}${result.message}`);
            }

            return redirect(`${redirectUrl}Moderator removed`);
        } else if (action === 'promote') {
            const userId = formData.get("moderator_id");

            const community_url = params.url;
            const community = await getCommunity(request, community_url);
            const community_id = community.id;

            const result = await makeOwner(request, community_id, userId);

            if (!result) {
                return redirect(`${redirectUrl}Error promoting moderator`);
            }

            if (result.error) {
                return redirect(`${redirectUrl}${result.message}`);
            }

            return redirect(`${redirectUrl}Moderator promoted to owner`);
        } else {
            return redirect(`${redirectUrl}Unsupported action`);
        }


    } catch (err) {
        console.log(err);
        return redirect(`${redirectUrl}Error: ${err.message}`);
    }
}

export default function CommunityModeratorsPage({}) {
    const { owner, moderators, is_owner, message } = useLoaderData();

    return (
        <main>
            <OptionalErrorMessage message={message} />
            {owner &&
                <>
                <h2>Community owner</h2>
                <UserCard user={owner} />
                </>
            }
            {moderators &&
                <>
                <h2>Moderators</h2>
                
                {moderators.map((moderator) => (
                    <UserCard user={moderator} display_make_owner_button={is_owner} display_remove_button={is_owner} />
                ))}

                
                {is_owner &&
                    <>
                    <h3>Add</h3>
                    <form method="post" className="add-moderator-form">
                        <input type="hidden" name="action" value="add" />
                        <input type="text" name="username" placeholder="Username" required />
                        <button type="submit">Add</button>
                    </form>
                    </>
                }
                </>
            }
        </main>
    );
}

function UserCard({ user, display_remove_button = false, display_make_owner_button = false }) {
    return (
        
            <div class="moderator-card" >
                <span>&#128100; {user.username}</span>
                <div className="moderator-action-box">
                    {display_remove_button &&
                        <Form method="post">
                            <input type="hidden" name="moderator_id" value={user.user_id} />
                            <input type="hidden" name="action" value="remove" />
                            <button type="submit">Remove</button>
                        </Form>
                    }
                    {display_make_owner_button &&

                        <Form method="post">
                            <input type="hidden" name="moderator_id" value={user.user_id} />
                            <input type="hidden" name="action" value="promote" />
                            <button type="submit">Make owner</button>
                        </Form>
                    }
                </div>               
            </div>
        
    );
}