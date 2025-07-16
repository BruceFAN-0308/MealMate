'use client';

import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import PageContainer from '../components/PageContainer';
import { fetchRecipes } from '../../lib/fetchRecipes';
import { MealDBRecipe } from '../../types';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<MealDBRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searched, setSearched] = useState<boolean>(false);

  const handleSearch = async (term: string): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      setSearched(true);
      const data = await fetchRecipes(term);
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setError('Something went wrong while fetching recipes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageContainer>
        <div className="animation-fade-in">
          <div className="text-center mb-8">
            <h1 className="page-title">Discover Amazing Recipes</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Search through thousands of recipes from around the world
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="loading-spinner w-8 h-8"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Searching for delicious recipes...
              </span>
            </div>
          )}
          
          {error && (
            <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4 mb-6 max-w-2xl mx-auto">
              <p className="text-red-600 dark:text-red-400 text-center font-medium">
                {error}
              </p>
            </div>
          )}
          
          {!loading && searched && recipes.length === 0 && (
            <div className="card p-8 text-center max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                No recipes found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try searching with different keywords or check your spelling
              </p>
            </div>
          )}

          {!searched && !loading && (
            <div className="card p-8 text-center max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🍳</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Start Your Culinary Journey
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Search for recipes by ingredient, cuisine, or dish name
              </p>
            </div>
          )}

          {recipes.length > 0 && (
            <div className="animation-slide-up">
              <h2 className="section-title text-center mb-6">
                Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
              </h2>
              <div className="grid grid-cols-4 gap-6">
                {recipes.map((meal: MealDBRecipe) => (
                  <RecipeCard key={meal.idMeal} recipe={meal} />
                ))}
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
