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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/recipes" className="inline-block mb-6">
            <div className="group flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                Back to Recipes
              </span>
            </div>
          </Link>

          {/* Main Content Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            
            {/* Hero Section with Image */}
            <div className="relative">
              {recipe.image_url && (
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              )}
              
              {/* Recipe Title Overlay */}
              <div className={`${recipe.image_url ? 'absolute bottom-0 left-0 right-0 text-white' : 'relative text-gray-900 dark:text-white'} p-8`}>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-3xl">🍽️</span>
                  <h1 className="text-4xl font-bold leading-tight">{recipe.title}</h1>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  {recipe.category && (
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full ${
                      recipe.image_url 
                        ? 'bg-white/20 backdrop-blur-sm text-white' 
                        : 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                    }`}>
                      <span>🏷️</span>
                      <span>{recipe.category}</span>
                    </span>
                  )}
                  {recipe.origin && (
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full ${
                      recipe.image_url 
                        ? 'bg-white/20 backdrop-blur-sm text-white' 
                        : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    }`}>
                      <span>🌍</span>
                      <span>{recipe.origin}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="p-8 space-y-8">
              
              {/* Ingredients Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="text-2xl">🥕</span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ingredients</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                    {recipe.ingredients?.length || 0} items
                  </span>
                </div>
                
                <div className="grid gap-3">
                  {recipe.ingredients?.map((item: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors">
                      <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="text-2xl">👨‍🍳</span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Instructions</h2>
                </div>
                
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-orange-100 dark:border-gray-600">
                    <pre className="whitespace-pre-line text-gray-800 dark:text-gray-200 font-sans leading-relaxed">
                      {recipe.instructions}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Video Section */}
              {recipe.video_url && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                    <span className="text-2xl">🎥</span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Video Tutorial</h2>
                  </div>
                  
                  <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <iframe
                      className="w-full aspect-video"
                      src={`https://www.youtube.com/embed/${new URL(recipe.video_url).searchParams.get('v')}`}
                      allowFullScreen
                      title={`${recipe.title} Tutorial`}
                    ></iframe>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="/recipes" className="inline-block">
              <div className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-700">
                Browse More Recipes
              </div>
            </Link>
            <Link href="/recipes/new" className="inline-block">
              <div className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                ✨ Create Your Own
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Fallback: Fetch from TheMealDB
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${params.id}`);
  const data: MealDBResponse = await res.json();
  const meal: MealDBRecipe | null = data.meals?.[0] || null;

  if (!meal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recipe Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The recipe you are looking for does not exist.</p>
          <Link href="/recipes">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              Browse Recipes
            </div>
          </Link>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/recipes" className="inline-block mb-6">
          <div className="group flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              Back to Recipes
            </span>
          </div>
        </Link>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Hero Section with Image */}
          <div className="relative">
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            {/* Recipe Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 text-white p-8">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-3xl">🍽️</span>
                <h1 className="text-4xl font-bold leading-tight">{meal.strMeal}</h1>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white">
                  <span>🏷️</span>
                  <span>{meal.strCategory}</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white">
                  <span>🌍</span>
                  <span>{meal.strArea}</span>
                </span>
                {meal.strTags && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white">
                    <span>🏷️</span>
                    <span>{meal.strTags}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-8 space-y-8">
            
            {/* Ingredients Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                <span className="text-2xl">🥕</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ingredients</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                  {ingredients.length} items
                </span>
              </div>
              
              <div className="grid gap-3">
                {ingredients.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                <span className="text-2xl">👨‍🍳</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Instructions</h2>
              </div>
              
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-orange-100 dark:border-gray-600">
                  <pre className="whitespace-pre-line text-gray-800 dark:text-gray-200 font-sans leading-relaxed">
                    {meal.strInstructions}
                  </pre>
                </div>
              </div>
            </div>

            {/* Video Section */}
            {meal.strYoutube && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="text-2xl">🎥</span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Video Tutorial</h2>
                </div>
                
                <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <iframe
                    className="w-full aspect-video"
                    src={`https://www.youtube.com/embed/${new URL(meal.strYoutube).searchParams.get('v')}`}
                    allowFullScreen
                    title={`${meal.strMeal} Tutorial`}
                  ></iframe>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/recipes" className="inline-block">
            <div className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-700">
              Browse More Recipes
            </div>
          </Link>
          <Link href="/recipes/new" className="inline-block">
            <div className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              ✨ Create Your Own
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
