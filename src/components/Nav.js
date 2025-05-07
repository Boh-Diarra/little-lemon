import { Link } from 'react-router-dom';
import './Nav.css';
import { useState } from 'react';

function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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
            
            <button 
                className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
                <li><Link to="/menu" onClick={() => setIsMenuOpen(false)}>Menu</Link></li>
                <li><Link to="/reservations" onClick={() => setIsMenuOpen(false)}>Reservations</Link></li>
                <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            </ul>
        </nav>
    );
}

export default Nav;