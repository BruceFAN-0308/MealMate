'use client';

import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { fetchRecipes } from 'lib/fetchRecipes';

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (term: string) => {
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
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Search Recipes</h1>
      <SearchBar onSearch={handleSearch} />
      
      {loading && <p className="text-center mt-6">Loading recipes...</p>}
      {error && <p className="text-red-500 text-center mt-6">{error}</p>}
      {!loading && searched && recipes.length === 0 && (
        <p className="text-center mt-6">No recipes found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {recipes.map((meal: Meal) => (
          <RecipeCard key={meal.idMeal} recipe={meal} />
        ))}
      </div>
    </div>
  );
}
