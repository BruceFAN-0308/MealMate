export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🍽️</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                MealMate
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover delicious recipes from around the world and create your own recipe collection
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="/recipes" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Browse Recipes
                </a>
              </li>
              <li>
                <a href="/recipes/new" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Add Recipe
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  My Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Built With
            </h3>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">
                Next.js
              </span>
              <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded">
                Supabase
              </span>
              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded">
                Tailwind CSS
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © 2025 MealMate. Made by{' '}
            <a
                href="https://www.linkedin.com/in/bruce--fan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              BruceFan
            </a>{' '}
            and{' '}
            <a
                href="https://www.linkedin.com/in/ernest-san-luis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ernest San Luis
            </a>{' '}
            for better cooking experiences.
          </p>
        </div>

      </div>
    </footer>
  );
}
