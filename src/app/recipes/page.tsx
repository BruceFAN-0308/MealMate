'use client';

import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { fetchRecipes } from '../lib/fetchRecipes';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);

  const handleSearch = async (term: string) => {
    const data = await fetchRecipes(term);
    setRecipes(data);
  };

  return (
    <div className="p-4">
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {recipes.map((meal: any) => (
          <RecipeCard key={meal.idMeal} recipe={meal} />
        ))}
      </div>
    </div>
  );
}
