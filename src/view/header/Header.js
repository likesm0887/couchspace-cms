import logo from '../img/header/logo.png';
import './header.css'
import * as React from 'react';
import Personal from "./Personal";

function Header() {
    return (
        <header>
            <img style={{ objectFit: 'contain' }} src={logo} className="logo" alt="logo" />
            <Personal></Personal>
        </header>

    );

}


export default Header;
