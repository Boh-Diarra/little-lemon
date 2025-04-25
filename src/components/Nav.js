import { Link } from 'react-router-dom';
import './Nav.css';

function Nav(){
    return (
        <nav className="navbar">
            <div className="nav-logo">
                <img 
                    src="/images/logo.png" 
                    alt="Little Lemon Logo" 
                    width="200" 
                    height="50"
                />
            </div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/menu">Menu</Link></li>
                <li><Link to="/reservations">Reservations</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
        </nav>
    )
}

export default Nav;