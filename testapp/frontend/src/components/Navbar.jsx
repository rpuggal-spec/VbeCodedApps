import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">MyFinance</Link>
        </div>
        <ul className="hidden md:flex space-x-6">
          <li><Link to="/" className="hover:text-blue-600">Investing</Link></li>
          <li><Link to="/" className="hover:text-blue-600">Retirement</Link></li>
          <li><Link to="/" className="hover:text-blue-600">Why Us</Link></li>
        </ul>
        <div className="space-x-3">
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Log in
          </Link>
          <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
