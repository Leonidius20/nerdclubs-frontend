import { getSession, destroySession } from "../cookies";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/", { headers: {"Set-Cookie": await destroySession(session)} });
}