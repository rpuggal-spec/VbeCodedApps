import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} MyFinance. All rights reserved.
      </div>
    </footer>
  );
}
