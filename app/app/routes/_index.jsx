import { Link, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { getUsers } from "~/models/user.server";
import stylesUrl from "~/styles/index.css";

export const meta = () => {
  return [{ title: "New Remix App" }];
};

export const loader = async () => {
  return new Response(JSON.stringify({users: await getUsers() }), {
    headers: {
      "Content-Type": "application/json",
      },
  });
};

export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  const { users } = useLoaderData();
  console.log(users);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome</h1>
      <ul>
        <li>
          <Link to="/login">Log in</Link>
        </li>
      </ul>
      <div>
        <h2>Users</h2>
        {JSON.stringify(users)}
      </div>
    </div>
  );
}
