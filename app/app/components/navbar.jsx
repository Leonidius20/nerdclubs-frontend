


export default function Navbar({ isUserLoggedIn, username }) {
    return (
        <nav> 
            <div>
                <a href="/">Home</a>
                {!isUserLoggedIn ? <a href="/login">Log in</a> : null }
                {!isUserLoggedIn ? <a href="/register">Register</a> : null }
                {isUserLoggedIn ? <a href="/subscriptions">Subscriptions</a> : null }
            </div>   
            <div>
                {isUserLoggedIn ? <a href="/account">Account ({username})</a> : null }
                {isUserLoggedIn ? <a href="/logout">Log out</a> : null }
            </div>
        </nav>
    )
}