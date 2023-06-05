import { useState } from "react";
import OptionalErrorMessage from "../../components/optional.error.message";
import { Form, useFetcher } from "@remix-run/react";
import { Editable, useEditor } from "@wysimark/react"
import Card from "../../components/card";

export default function AddPostView({ message, communityUrl, categoryId, category, categories }) {
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const fetcher = useFetcher();

    const editor = useEditor({
        initialMarkdown: "",
        height: "500px",
        authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlljN3dzSHVxcmlLS2hDMVYifQ.eyJpYXQiOjE2ODUxODk1MTMsImV4cCI6MzE1NTc2MDAxNjUzNjMxOTAwfQ.D1Xk1HiwxcU6eeqcNjpOwWSycXBWxKYqfsvdCOf50gk",
    });

    const onSubmitButton = (event) => {
        event.preventDefault();
        const content = editor.getMarkdown();
        fetcher.submit(
            { title, content, communityUrl, categoryId },
            {
              method: "post",
              
            }
          );
    };

    const onBaclButton = (event) => {
        event.preventDefault();
        
    };

    return (
        <Card title="Add Post" backUrl={`../${categoryId}`} message={message}>
            <Form method="POST" onSubmit={onSubmitButton}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" value={title} onInput={e => setTitle(e.target.value)}  required />
                </div>
                <div>
                    <label htmlFor="content">Content</label>
                    {/*<textarea id="content" name="content" rows="3" required value={content} onChange={e => setContent(e.target.value)}></textarea>*/}
                    <Editable editor={editor}/>
                </div>
                <button type="submit">Add Post</button>
            </Form>
        </Card>
    );
}