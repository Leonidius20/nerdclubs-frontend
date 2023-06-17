import { Link, Outlet, useLoaderData, useActionData } from "@remix-run/react";
import stylesUrl from "~/styles/index.css";
import homepageCss from "~/styles/homepage.css";
import communityCard from "~/styles/community.card.css";
import { getUserInfoOrNull, isUserFullyAuthenticated } from "../cookies";
import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import CommunitiesList from "../components/communities.list";
import { getCommunities } from "../models/communities.server";
import { getUserDataByToken } from "../models/user.server";

export const handle = { hydrate: true };

export const meta = () => {
  return [{ title: "Homepage" }];
};

export const links = () => {
  return [
    { rel: "stylesheet", href: stylesUrl },
    { rel: "stylesheet", href: homepageCss },
    { rel: "stylesheet", href: communityCard },
  ];
};

export const loader = async ({ request }) => {
  const isUserLoggedIn = await isUserFullyAuthenticated(request);

  // load some communities
  const communities = await getCommunities();

  const user = await getUserDataByToken(request);
  const isAdmin = user?.privilege_level === 2;

  return json({ isUserLoggedIn, communities, isAdmin });
};

export const action = async ({ request }) => {
  const form = await request.formData();
  const query = form.get("query");

  try {
    const communities = await getCommunities(query);

    if (communities.error) return json({ message: communities.message });

    return json({ communities });
  } catch (err) {
    console.log(err);
    return json({ message: "FR: " + err.message });
  }
  
};



export default function Index() {
  let { isUserLoggedIn, communities, isAdmin } = useLoaderData();
  const actionData = useActionData();

  if (actionData) {
    communities = actionData.communities;
  }

  return (
    <>
    <main>
      <Form method="post">
        <input type="search" name="query" placeholder="Search communities..." />
        <button type="submit">Search</button>
        {isUserLoggedIn && <a href="/create/community" className="link-button">Create new</a>}
      </Form>
      <CommunitiesList communities={communities} />
      
    </main>
    {
      isAdmin && (
        <footer>
          <h2>Admin functions</h2>
          <Link to="/admin/banned">Banned users</Link>
        </footer>
      )
    }
    </>
  );
}
