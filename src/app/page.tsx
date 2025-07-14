import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold mb-6">🍽️ Welcome to MealMate</h1>
        <p className="text-lg text-gray-400 mb-8">
          Discover delicious recipes from around the world or create and manage your own!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/recipes"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition"
          >
            Browse Recipes
          </Link>
          <Link
            href="/dashboard"
            className="bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold transition"
          >
            My Dashboard
          </Link>
          <Link
            href="/recipes/new"
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition"
          >
            Add New Recipe
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          Built with ❤️ using Next.js, Supabase, and TailwindCSS
        </div>
      </div>
    </main>
  );
}