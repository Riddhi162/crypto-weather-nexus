import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-gray-900 text-gray-100 shadow">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold">CryptoWeather Dashboard</h1>
        <p className="mt-2 text-teal-400">Your all-in-one information center</p>
      </div>
    </header>
  );
}
