import OptionalErrorMessage from "../../components/optional.error.message";

export default function AddPostView({ message, communityUrl, categoryId, category, categories }) {
    return (
        <main>
            <OptionalErrorMessage message={message} />
            <h1>Add Post</h1>
            <form method="POST">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" />
                </div>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <textarea className="form-control" id="content" name="content" rows="3"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Add Post</button>
            </form>
        </main>
    )
}