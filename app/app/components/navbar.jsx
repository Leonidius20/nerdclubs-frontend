


export default function Navbar({ isUserLoggedIn }) {
    return (
        <nav>    
            <a href="/">Home</a>
            <a href="/login">Log in</a>
            <a href="/register">Register</a>
            <a href="/logout">Log out</a>
            <a href="/account">Account</a>
        </nav>
    )
}