import { Form } from "@remix-run/react";
import Card from "../../components/card";
import OptionalErrorMessage from "../../components/optional.error.message";

export default function AddCategoryView({ message }) {
    return (
        <Card title="Add category" backUrl="./" message={message}>
            <Form method="post">
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" required />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <input type="text" name="description" id="description" />
                </div>
                
                <button type="submit" className="main-action-button">Add category</button>
            </Form>
        </Card>
    );
}