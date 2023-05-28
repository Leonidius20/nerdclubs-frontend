export default function List({ content }) {
    return (
        <ul>
            {content.map(item => <ListItem key={item} item={item} />)}
        </ul>
    );
}

function ListItem({ item }) {
    return (
        <li>
            <a href={item.url} className={item.available ? "available" : "unavailable"}>
                    <div>
                        <p>{item.name}</p>
                        <small>{item.comment}</small>
                    </div>
            </a>
        </li>
    );
}