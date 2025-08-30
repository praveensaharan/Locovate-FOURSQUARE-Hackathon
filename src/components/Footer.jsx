export default function Footer() {
  return (
    <footer role="contentinfo" className="bg-gray-900 border-t border-indigo-600 text-gray-300 py-6 mt-12 relative">

      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6">
  <div className="z-30 pointer-events-auto opacity-70 ">
        <img src="/PNG-favicon.png" alt="Logo" className="w-8 h-8 object-contain" />
      </div>
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} <span className="text-indigo-400 font-semibold">Around Me AI</span>. All rights reserved.
        </p>     
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">Powered by</span>
          <a
            href="https://foursquare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition"
          >
            Foursquare
          </a>
          <span>•</span>
          <a
            href="https://openai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition"
          >
            OpenAI
          </a>
          <span>•</span>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 transition"
          >
            Google Maps
          </a>
        </div>
      </div>
    </footer>
  );
}
