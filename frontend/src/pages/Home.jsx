import React from "react";

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Invest for your future</h1>
          <p className="max-w-lg mb-6">
            Build a better financial tomorrow with our trusted investment tools and guidance.
          </p>
          <a href="#" className="bg-white text-blue-700 px-6 py-3 rounded font-semibold hover:bg-gray-100">
            Get Started
          </a>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
        {[
          { title: "Low-cost investments", text: "Keep more of your money working for you with our low expense ratios." },
          { title: "Trusted guidance", text: "Expert insights to help you stay on track toward your goals." },
          { title: "Diverse options", text: "From index funds to ETFs, find the right mix for your portfolio." },
        ].map((f, i) => (
          <div key={i} className="bg-white p-6 rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
