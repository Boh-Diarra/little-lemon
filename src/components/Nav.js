import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src="images/logo.png" alt="Little Lemon" />
                </Link>
                
                <div className="menu-icon" onClick={toggleMenu}>
                    <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
                </div>

                <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
                    <li className="nav-item">
                        <Link to="/" className="nav-link" onClick={toggleMenu}>
                            Accueil
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/about" className="nav-link" onClick={toggleMenu}>
                            À propos
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/menu" className="nav-link" onClick={toggleMenu}>
                            Menu
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/reservations" className="nav-link" onClick={toggleMenu}>
                            Réservations
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/order-online" className="nav-link" onClick={toggleMenu}>
                            Commander en ligne
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" className="nav-link" onClick={toggleMenu}>
                            Connexion
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Nav;