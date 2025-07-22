import Link from 'next/link';
import PageContainer from './components/PageContainer';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <PageContainer className="flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-4xl text-center animation-fade-in">
          <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🍽️ Welcome to MealMate
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Discover delicious recipes from around the world or create and manage your own culinary masterpieces!
          </p>

          <div className="grid grid-cols-4 gap-6 mb-12">
            <Link
              href="/recipes"
              className="group card p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Browse Recipes</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore thousands of recipes from different cuisines
              </p>
            </Link>
            
            <Link
              href="/meal-plans"
              className="group card p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📅</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Meal Plans</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Plan your weekly meals and organize your cooking schedule
              </p>
            </Link>
            
            <Link
              href="/dashboard"
              className="group card p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📋</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">My Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your personal recipe collection
              </p>
            </Link>
            
            <Link
              href="/recipes/new"
              className="group card p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">➕</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Add Recipe</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share your favorite recipes with the world
              </p>
            </Link>
          </div>

          <div className="flex gap-4 justify-center mb-12">
            <Link
              href="/recipes"
              className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold"
            >
              Get Started
            </Link>
            <Link
              href="/meal-plans"
              className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold"
            >
              Plan Your Meals
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Next.js</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Supabase</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>TailwindCSS</span>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}