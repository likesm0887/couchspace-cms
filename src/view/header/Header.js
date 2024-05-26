import logo from '../img/header/logo.png';
import './header.css'
import * as React from 'react';
import Personal from "./Personal";

function Header() {
    let currentHtml = window.location.href;
    return (
        <header>
            <div class="container-fluid">
                <div class="row row-cols-auto align-items-center" style={{ height: 100 }}>
                    <div class="col-8">
                        <a href={currentHtml}>
                            <img style={{ objectFit: 'contain' }} src={logo} className="logo" alt="logo" />
                        </a>
                    </div>
                    <div class="col-4">
                        <Personal></Personal>
                    </div>
                </div>
            </div>

        </header>

    );

}


export default Header;
