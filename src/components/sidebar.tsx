import React from "react";
import Link from "next/link";
import { FaTshirt } from "react-icons/fa";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-[#171717] text-white h-screen flex flex-col items-center py-6 shadow-lg"> {/* Updated Background Color */}
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-6">
        <img
          src="/logocanva.png"
          alt="StyleBuddy Logo"
          className="w-16 h-16 rounded-full border-2 border-gray-600 shadow-md"
        />
        <h1 className="text-2xl font-extrabold text-gray-100">StyleBuddy</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col items-center w-full">
        <NavItem href="/" label="Home" />
        <NavItem href="/chat" label="Chat" />
        <NavItem href="/about" label="About" />
      </nav>
    </div>
  );
};

// Navigation Link Component with Styling
const NavItem: React.FC<{ href: string; label: string }> = ({ href, label }) => {
  return (
    <Link
      href={href}
      className="w-full text-center py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition duration-300 rounded-md"
    >
      {label}
    </Link>
  );
};

export default Sidebar;
