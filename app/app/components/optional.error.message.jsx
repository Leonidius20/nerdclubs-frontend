export default function OptionalErrorMessage({ message }) {

    if (!message) {
        return <></>;
    }

    return (
        <div id="error-message-box">
            <p role="alert">{message}</p>
        </div>
    );
}