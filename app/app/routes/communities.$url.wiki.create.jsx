import { json, redirect } from "@remix-run/node";
import Card from "~/components/card.jsx";
import { useFetcher, useLoaderData, useMatches } from "@remix-run/react";
import wideCardCss from "~/styles/form.wide.css";
import { createWikiPage } from "../models/wiki.pages.server";
import { getCommunity } from "../models/communities.server";
import { Editable, useEditor } from "@wysimark/react"
import { useState } from "react";
import WikiPageEditorView from "../views/wiki.page.editor.view";

export const handle = { hydrate: true };

export const links = () => [
    { rel: "stylesheet", href: wideCardCss },
];

export const loader = async ({ request }) => {
    // get optional page url
    const url = new URL(request.url);
    const page_url = url.searchParams.get("url"); 
    const message = url.searchParams.get("message");

    return json({ page_url, message });
}

export const action = async ({ request, params }) => {
    const form = await request.formData();
    const title = form.get("title");
    const page_url = form.get("page_url");
    const content = form.get("content");

    // commuity url
    const community_url = params.url;
    const community = await getCommunity(request, community_url);
    const community_id = community.id;

    console.log(community_id);


    if (!title || !page_url) {
        return redirect(`?message=Title and URL are required`);
    }

    const result = await createWikiPage(request, page_url, title, content, community_id);
    if (!result || result.error) {
        return redirect(`?message=${result ? result.message : "Unknown error"}`);
    }
    

    return redirect(`/communities/${community_url}/wiki/pages/${page_url}`);
}

export default function CreateWikiPage() {
    /*const loaderData = useLoaderData();
    const message = loaderData.message;

    const [title, setTitle] = useState('');
    const [pageUrl, setPageUrl] = useState(loaderData.page_url);

    const fetcher = useFetcher();

    const editor = useEditor({
        initialMarkdown: "",
        height: "500px",
        authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlljN3dzSHVxcmlLS2hDMVYifQ.eyJpYXQiOjE2ODUxODk1MTMsImV4cCI6MzE1NTc2MDAxNjUzNjMxOTAwfQ.D1Xk1HiwxcU6eeqcNjpOwWSycXBWxKYqfsvdCOf50gk",
    });

    const onFormSubmit = (event) => {
        event.preventDefault();
        const content = editor.getMarkdown();
        fetcher.submit(
            { title, page_url: pageUrl, content },
            {
                method: "post",
            }
        );
    };

    return (
        <Card title="Create wiki page" message={message}>
            <form method="POST" id="create-wiki-page-form" onSubmit={onFormSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" required value={title} onInput={e => setTitle(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="page_url">Page url</label>
                    <input type="text" name="page_url" required value={pageUrl} onInput={e => setPageUrl(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="content">Content</label>
                    <small>When adding links to other wiki pages, use ./{String.fromCharCode(123)}url{String.fromCharCode(125)} format.</small>
                    <Editable editor={editor}/>
                </div>
                <button type="submit">Create</button>
            </form>
        </Card>
    );*/

    const loaderData = useLoaderData();
    const message = loaderData.message;
    const suggestedPageUrl = loaderData.page_url;

    const [title, setTitle] = useState('');
    const [page_url, setPageUrl] = useState(suggestedPageUrl);

    const fetcher = useFetcher();

    const editor = useEditor({
        initialMarkdown: '',
        height: "500px",
        authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlljN3dzSHVxcmlLS2hDMVYifQ.eyJpYXQiOjE2ODUxODk1MTMsImV4cCI6MzE1NTc2MDAxNjUzNjMxOTAwfQ.D1Xk1HiwxcU6eeqcNjpOwWSycXBWxKYqfsvdCOf50gk",
    });

    const onFormSubmit = (event) => {
        event.preventDefault();
        const content = editor.getMarkdown();
        fetcher.submit(
            { title, page_url, content },
            {
                method: "post",
            }
        );
    };

    // get community id from higher paths
    const matches = useMatches();

    
    // find match where url = /communities/$url
    const data = matches.find((match) => match.id === 'routes/communities.$url')?.data;
    const community = data.community;
    console.log(community);
    
    return <WikiPageEditorView message={message} title={title} onTitleChange={setTitle} url={page_url} onUrlChange={setPageUrl} editor={editor} onFormSubmit={onFormSubmit}/>
}