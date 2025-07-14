'use client';

import { useEffect, useState } from 'react';
import { supabase } from 'lib/supabase';
import Link from 'next/link';

interface Recipe {
  id: string;
  title: string;
  image_url: string;
  category: string;
  origin: string;
}

export default function DashboardPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase.from('recipes').select('*');
      if (error) {
        console.error('Error fetching recipes:', error.message);
      } else {
        setRecipes(data);
      }
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">📋 My Recipes</h1>

      {loading ? (
        <p className="text-gray-300">Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-300">No recipes found. Start by creating one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="bg-gray-900 p-4 rounded shadow hover:shadow-lg hover:bg-gray-800 transition"
            >
              {recipe.image_url && (
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h2 className="text-xl font-semibold text-white">{recipe.title}</h2>
              <p className="text-sm text-gray-400">
                {recipe.category} · {recipe.origin}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
