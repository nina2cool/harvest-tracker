import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-blue-600 text-white p-4">
            <nav className="flex justify-between">
                <h1 className="text-xl font-bold">Time Tracking App</h1>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/users" className="hover:underline">Users</Link>
                    </li>
                    <li>
                        <Link to="/time-entries" className="hover:underline">Time Entries</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;

