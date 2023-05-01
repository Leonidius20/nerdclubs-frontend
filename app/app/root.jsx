import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches
} from "@remix-run/react";
import globalStylesUrl from "~/styles/global.css";
import Navbar from "./components/navbar";

export const links = () => {
  return [{ rel: "stylesheet", href: globalStylesUrl }];
};

export default function App() {
  const matches = useMatches();

  const includeScripts = matches.some((match) => match.handle ? match.handle.hydrate : undefined);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar/>
        <Outlet />
        { /* <ScrollRestoration /> */ }
        {includeScripts ? <Scripts /> : null}
        <LiveReload />
      </body>
    </html>
  );
}
