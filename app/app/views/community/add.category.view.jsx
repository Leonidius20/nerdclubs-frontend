import OptionalErrorMessage from "../../components/optional.error.message";

export default function AddCategoryView({ message }) {
    return (
        <main>
            <h1>Add category</h1>
            <OptionalErrorMessage message={message} />
            <form method="post">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" required />
                <label htmlFor="description">Description</label>
                <input type="text" name="description" id="description" />
                <button type="submit">Add category</button>
            </form>
        </main>
    );
}