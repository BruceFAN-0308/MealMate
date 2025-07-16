import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { RecipeDetailPageProps, SupabaseRecipe, MealDBResponse, MealDBRecipe } from '../../../types';

export default async function RecipeDetail({ params }: RecipeDetailPageProps) {
  // 1. Try fetching from Supabase
  const { data: sbRecipe } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', params.id)
    .single();

  if (sbRecipe) {
    const recipe: SupabaseRecipe = sbRecipe;
    
    return (
      <div className="p-4 max-w-3xl mx-auto text-white">
        <Link href="/recipes">
          <button className="mb-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
            ← Back to Recipes
          </button>
        </Link>

        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-gray-400 mb-4">
            {recipe.category} | {recipe.origin}
          </p>
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="rounded-lg w-full mb-6"
            />
          )}
          <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc list-inside mb-6 space-y-1">
            {recipe.ingredients?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
          <p className="whitespace-pre-line">{recipe.instructions}</p>
        </div>
      </div>
    );
  }

  // 2. Fallback: Fetch from TheMealDB
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${params.id}`);
  const data: MealDBResponse = await res.json();
  const meal: MealDBRecipe | null = data.meals?.[0] || null;

  if (!meal) {
    return <div className="p-4 text-red-600">Recipe not found.</div>;
  }

  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}` as keyof MealDBRecipe];
    const measure = meal[`strMeasure${i}` as keyof MealDBRecipe];
    if (ing && ing.trim()) {
      ingredients.push(`${measure?.trim() || ''} ${ing.trim()}`.trim());
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Link href="/recipes">
        <button className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
          ← Back to Recipes
        </button>
      </Link>

      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">{meal.strMeal}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {meal.strCategory} | {meal.strArea} {meal.strTags ? `| Tags: ${meal.strTags}` : ''}
        </p>

        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="rounded-lg w-full mb-6 border border-gray-200 dark:border-gray-700"
        />

        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Ingredients</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-1">
          {ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Instructions</h2>
        <p className="whitespace-pre-line text-gray-800 dark:text-gray-300">{meal.strInstructions}</p>

        {meal.strYoutube && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Video Tutorial</h2>
            <iframe
              className="w-full aspect-video rounded-lg border border-gray-200 dark:border-gray-700"
              src={`https://www.youtube.com/embed/${new URL(meal.strYoutube).searchParams.get('v')}`}
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}
