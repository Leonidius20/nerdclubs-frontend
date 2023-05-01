import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getUsers } from "~/models/user.server";
import stylesUrl from "~/styles/index.css";
import { isUserFullyAuthenticated } from "../cookies";
import { json } from "@remix-run/node";
import Navbar from "../components/navbar";

export const meta = () => {
  return [{ title: "Homepage" }];
};

export const loader = async ({ request }) => {
  const users = await getUsers();
  const isUserLoggedIn = await isUserFullyAuthenticated(request);

  return json({ users, isUserLoggedIn });
};

export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  const { users, isUserLoggedIn } = useLoaderData();

  return (
    <div style={{ lineHeight: "1.4" }}>
      <main>
        <h1>Welcome</h1>
      <ul>
        <li>
          {isUserLoggedIn ? <Link to="/logout">Log out</Link> : <Link to="/register">Register</Link>} 
        </li>
        
          {!isUserLoggedIn 
          ? 
          <li><Link to="/login">Log in</Link></li> 
          : null
          }
        
        <li>
          {isUserLoggedIn && <Link to="/account">My account</Link>}
        </li>
      </ul>
      <div>
        <h2>Users</h2>
        <p>{JSON.stringify(users)}</p>
      </div>
      </main>
    </div>
  );
}
