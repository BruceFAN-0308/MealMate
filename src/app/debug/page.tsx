'use client';

import { useEffect, useState } from 'react';
import { supabase } from "../../lib/supabase";
import PageContainer from "../components/PageContainer";
import Link from 'next/link';
import { SupabaseRecipe } from '../../types';

export default function DebugPage() {
  const [recipes, setRecipes] = useState<SupabaseRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const { data, error } = await supabase.from('recipes').select('*');
        if (error) {
          console.error('Supabase error:', error);
          setError(`Database error: ${error.message}`);
        } else {
          setRecipes(data || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageContainer>
        <div className="animation-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="page-title flex items-center">
                <span className="mr-3">🐛</span>
                Debug - Supabase Recipes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Raw data from Supabase database for debugging purposes
              </p>
            </div>
            <Link 
              href="/dashboard"
              className="btn btn-outline btn-md"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="loading-spinner w-8 h-8"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Loading recipes from database...
              </span>
            </div>
          ) : error ? (
            <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">❌</span>
                <div>
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                    Error
                  </h3>
                  <p className="text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          ) : recipes.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                No recipes found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The database is empty. Try adding some recipes first.
              </p>
            </div>
          ) : (
            <div className="animation-slide-up">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="card p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {recipes.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Recipes
                  </div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {new Set(recipes.map(r => r.category)).size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Categories
                  </div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {new Set(recipes.map(r => r.origin)).size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Origins
                  </div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {recipes.reduce((acc, r) => acc + (r.ingredients?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Ingredients
                  </div>
                </div>
              </div>

              {/* Raw Data */}
              <div className="card">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Raw Database Records
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Origin
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Ingredients
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {recipes.map((recipe) => (
                        <tr key={recipe.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                            {recipe.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            <Link 
                              href={`/recipes/${recipe.id}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {recipe.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                              {recipe.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {recipe.origin}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            <div className="max-w-xs">
                              {recipe.ingredients?.slice(0, 3).map((ingredient, idx) => (
                                <div key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                                  {ingredient}
                                </div>
                              ))}
                              {recipe.ingredients && recipe.ingredients.length > 3 && (
                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                  +{recipe.ingredients.length - 3} more...
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {recipe.created_at ? new Date(recipe.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* JSON Debug */}
              <div className="card mt-6">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    JSON Debug Data
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Raw JSON response from Supabase
                  </p>
                </div>
                <div className="p-6">
                  <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto text-sm">
                    <code className="text-gray-800 dark:text-gray-200">
                      {JSON.stringify(recipes, null, 2)}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
