import Card from '../components/card.jsx';
import cardCss from '../styles/card.base.css';
import narrowCardCss from '../styles/card.narrow.css';

export const links = () => [
    { rel: 'stylesheet', href: cardCss },  
    { rel: 'stylesheet', href: narrowCardCss },
];

export default function Banned() {
    return (
        <Card title="You are banned">
            <p>Sorry, but your account is banned on the website. Contact administrators if you wish to appeal.</p>
        </Card>
    );
}