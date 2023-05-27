export default function OptionalErrorMessage({ message }) {
    return (
        <>
        {
            message && 
                <div id="error-message-box">
                    <p role="alert">{message}</p>
                </div>  
        }
        </>
    );
}