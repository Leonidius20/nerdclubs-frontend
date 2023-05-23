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

export const links = () => {
  return [{ rel: "stylesheet", href: globalStylesUrl }];
};

export const loader = async ({ request }) => {
  const isUserLoggedIn = await isUserFullyAuthenticated(request); 
  return json({ isUserLoggedIn });
};

export default function App() {
  const matches = useMatches();

  const includeScripts = matches.some((match) => match.handle ? match.handle.hydrate : undefined);

  const { isUserLoggedIn } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar isUserLoggedIn={isUserLoggedIn}/>
        <Outlet />
        { /* <ScrollRestoration /> */ }
        {includeScripts ? <Scripts /> : null}
        <LiveReload />
      </body>
    </html>
  );
}
