


export default function Navbar({ isUserLoggedIn, username }) {
    return (
        <nav>    
            <a href="/">Home</a>
            {!isUserLoggedIn ? <a href="/login">Log in</a> : null }
            {!isUserLoggedIn ? <a href="/register">Register</a> : null }
            {isUserLoggedIn ? <a href="/logout">Log out</a> : null }
            {isUserLoggedIn ? <a href="/account">Account ({username})</a> : null }
        </nav>
    )
}