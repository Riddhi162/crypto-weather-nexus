export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-100 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">CryptoWeather</h3>
              <p className="text-teal-400 mt-1">© {new Date().getFullYear()} All Rights Reserved</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-purple-400 transition">About</a>
              <a href="#" className="hover:text-purple-400 transition">Privacy</a>
              <a href="#" className="hover:text-purple-400 transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }