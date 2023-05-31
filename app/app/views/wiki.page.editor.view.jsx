import { Editable } from "@wysimark/react";
import Card from "~/components/card.jsx";

export default function WikiPageEditorView({ message, title, onTitleChange, url, onUrlChange, editor, onFormSubmit, pageId }) {

    return (
        <Card title="Create wiki page" message={message}>
            <form method="POST" id="create-wiki-page-form" onSubmit={onFormSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" required value={title} onInput={e => onTitleChange(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="page_url">Page url</label>
                    <input type="text" name="page_url" required value={url} onInput={e => onUrlChange(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="content">Content</label>
                    <small>When adding links to other wiki pages, use ./{String.fromCharCode(123)}url{String.fromCharCode(125)} format.</small>
                    <Editable editor={editor}/>
                </div>
                {pageId ? <input type="hidden" name="page_id" value={pageId} /> : ""}
                <button type="submit">Save</button>
            </form>
        </Card>
    );


}