


export default function Navbar({ isUserLoggedIn }) {
    return (
        <nav>    
            <a href="/">Home</a>
            {!isUserLoggedIn ? <a href="/login">Log in</a> : null }
            {!isUserLoggedIn ? <a href="/register">Register</a> : null }
            {isUserLoggedIn ? <a href="/logout">Log out</a> : null }
            {isUserLoggedIn ? <a href="/account">Account</a> : null }
        </nav>
    )
}