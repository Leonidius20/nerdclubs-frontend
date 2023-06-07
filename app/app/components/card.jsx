import OptionalErrorMessage from "./optional.error.message";

export default function Card({ children, title, backUrl, message }) {
    return (
        <main>
            <div className="card-title">
                {backUrl && <a className="back-button link-button" href={backUrl}>&#8592;</a>}
                <h1>{title}</h1>
            </div>
            <OptionalErrorMessage message={message} />
            {children}
        </main>
    );
}