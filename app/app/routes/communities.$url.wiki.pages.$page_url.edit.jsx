import WikiPageEditorView from "../views/wiki.page.editor.view";
import { useEditor } from "@wysimark/react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getCommunity } from "../models/communities.server";
import { getWikiPageByUrl, updateWikiPage } from "../models/wiki.pages.server";
import { useState } from "react";
import wideCardCss from "~/styles/form.wide.css";

export const handle = { hydrate: true };

export const links = () => [
    { rel: "stylesheet", href: wideCardCss },
];

export const loader = async ({ request, params }) => {
    // get message from url
    const url = new URL(request.url);
    const message = url.searchParams.get("message");

    const community_url = params.url;
    const page_url = params.page_url;

    // get community id
    const community = await getCommunity(request, community_url);
    const community_id = community.id;

    // get page
    const page = await getWikiPageByUrl(community_id, page_url);
    if (!page) {
        return json({ message: "Page not found", community_url, page_url }, { status: 404 });
    }
    if (page.error) {
        if (page.message == 'Not found') {
            return json({ not_found: true, community_url, page_url }, { status: 404 });
        } else {
            return json({ message: page.message, community_url, page_url }, { status: 500 });
        }
    }

    return json({ page, community_url, message });
}

export const action = async ({ request, params }) => {
    const form = await request.formData();
    const title = form.get("title");
    const page_url = form.get("page_url");
    const content = form.get("content");
    let page_id = form.get("page_id");

    // get page id
    if (!page_id) {
        const community_url = params.url;
        const community = await getCommunity(request, community_url);
        const community_id = community.id;
        const page = await getWikiPageByUrl(community_id, page_url);
        page_id = page.wiki_page_id;
    }

    if (!title || !page_url) {
        return redirect(`?message=Title and URL are required`);
    }

    const result = await updateWikiPage(request, page_id, title, content);

    if (!result || result.error) {
        return redirect(`?message=${result ? result.message : "Unknown error"}`);
    }

    return redirect(`../`);
}

export default function WikiPageEdit() {
    const { message, page, community_url } = useLoaderData();

    const fetcher = useFetcher();

    const editor = useEditor({
        initialMarkdown: page.content,
        height: "500px",
        authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlljN3dzSHVxcmlLS2hDMVYifQ.eyJpYXQiOjE2ODUxODk1MTMsImV4cCI6MzE1NTc2MDAxNjUzNjMxOTAwfQ.D1Xk1HiwxcU6eeqcNjpOwWSycXBWxKYqfsvdCOf50gk",
    });

    const [title, setTitle] = useState(page.title);
    const [pageUrl, setPageUrl] = useState(page.url);

    const onFormSubmit = (event) => {
        event.preventDefault();
        const content = editor.getMarkdown();
        fetcher.submit(
            { title, page_url: pageUrl, content },
            {
                method: "post",
            }
        );
    }

    return (
        <WikiPageEditorView message={message} editor={editor} title={title} onTitleChange={setTitle} url={pageUrl} onUrlChange={setPageUrl} onFormSubmit={onFormSubmit} pageId={page.wiki_page_id} />
    )
}