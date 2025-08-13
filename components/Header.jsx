export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center text-center py-10 bg-white">
      <h1 className="text-3xl font-bold text-gray-900">PDF Tools Online</h1>
      <h2 className="text-lg text-gray-600 mt-2">
        Fast, Private, 100% Free PDF Tools – No Sign-Up Needed
      </h2>
      <a href="#tools" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition">
        Start Now
      </a>
    </header>
  );
}
