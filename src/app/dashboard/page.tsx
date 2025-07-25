'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import PageContainer from '../components/PageContainer';
import { SupabaseRecipe } from '../../types';

export default function DashboardPage() {
  const [recipes, setRecipes] = useState<SupabaseRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipes = async (): Promise<void> => {
      const { data, error } = await supabase.from('recipes').select('*');
      if (error) {
        console.error('Error fetching recipes:', error.message);
      } else {
        setRecipes(data || []);
      }
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageContainer>
        <div className="animation-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="page-title flex items-center">
                <span className="mr-3">📋</span>
                My Recipe Collection
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and organize your personal recipes
              </p>
            </div>
            <Link 
              href="/recipes/new"
              className="btn btn-primary btn-lg"
            >
              <span className="mr-2">➕</span>
              Add New Recipe
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="loading-spinner w-8 h-8"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Loading your recipes...
              </span>
            </div>
          ) : recipes.length === 0 ? (
            <div className="card p-12 text-center max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🍽️</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                No recipes yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start building your recipe collection by adding your first recipe!
              </p>
              <Link 
                href="/recipes/new"
                className="btn btn-primary btn-lg"
              >
                <span className="mr-2">➕</span>
                Create Your First Recipe
              </Link>
            </div>
          ) : (
            <div className="animation-slide-up">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {recipes.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Recipes
                  </div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {new Set(recipes.map(r => r.category)).size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Categories
                  </div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {new Set(recipes.map(r => r.origin)).size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Cuisines
                  </div>
                </div>
              </div>

              {/* Recipe Grid */}
              <div className="grid grid-cols-4 gap-6">
                {recipes.map(recipe => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="recipe-card group"
                  >
                    <div className="relative overflow-hidden">
                      {recipe.image_url && (
                        <img
                          src={recipe.image_url}
                          alt={recipe.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-2">
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                          {recipe.category}
                        </span>
                        <span>•</span>
                        <span>{recipe.origin}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
