import Card from "../../components/card";
import Markdown from "markdown-to-jsx";

export default function WikiPageView({ title, content, backUrl, message }) {
    return (
        <Card title={title} message={message} backUrl={backUrl}>
            <article className='content'>
                <Markdown>{content}</Markdown>
            </article>
        </Card>
    );
}