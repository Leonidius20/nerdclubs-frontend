import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useMatches
} from "@remix-run/react";
import globalStylesUrl from "~/styles/global.css";

import Navbar from "./components/navbar";
import { isUserFullyAuthenticated } from "~/cookies";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { isNotBannedOrThrow } from "./cookies";

export const links = () => {
  return [{ rel: "stylesheet", href: globalStylesUrl }];
};

export const loader = async ({ request }) => {
  const isUserLoggedIn = await isUserFullyAuthenticated(request); 

  // check if accessing something other than /banned, /logout
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (pathname !== "/banned" && pathname !== "/logout") {
    const isNotBanned = await isNotBannedOrThrow(request);
  }
  
  return json({ isUserLoggedIn, username: request._username });
};

export default function App() {
  const matches = useMatches();

  const includeScripts = matches.some((match) => match.handle ? match.handle.hydrate : undefined);

  const { isUserLoggedIn, username } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar isUserLoggedIn={isUserLoggedIn} username={username}/>
        <Outlet />
        { /* <ScrollRestoration /> */ }
        {includeScripts ? <Scripts /> : null}
        <LiveReload />
      </body>
    </html>
  );
}
