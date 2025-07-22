'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { NewRecipeForm, LoadingState } from '../../../types';

export default function NewRecipePage() {
  const router = useRouter();
  const [form, setForm] = useState<NewRecipeForm>({
    title: '',
    category: '',
    origin: '',
    instructions: '',
    image_url: '',
    ingredients: '',
  });

  const [state, setState] = useState<LoadingState>({
    loading: false,
    error: '',
    success: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: '', success: '' }));

    const ingredientsArray = form.ingredients
      .split(',')
      .map(i => i.trim())
      .filter(i => i);

    const { error } = await supabase.from('recipes').insert([
      {
        ...form,
        ingredients: ingredientsArray,
      },
    ]);

    if (error) {
      console.error(error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to create recipe. Please try again.' 
      }));
    } else {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: 'Recipe created successfully!' 
      }));
      setTimeout(() => router.push('/dashboard'), 1500);
    }
  };

  const categories = [
    'Appetizer', 'Main Course', 'Dessert', 'Salad', 'Soup', 
    'Beverage', 'Snack', 'Breakfast', 'Lunch', 'Dinner'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mb-4">
            <span className="text-3xl">🍽️</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Recipe
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Share your culinary masterpiece with the world
          </p>
        </div>

        {/* Status Messages */}
        {state.error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-2">❌</span>
              <p className="text-red-800 dark:text-red-200 font-medium">{state.error}</p>
            </div>
          </div>
        )}
        
        {state.success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-500 text-xl mr-2">✅</span>
              <p className="text-green-800 dark:text-green-200 font-medium">{state.success}</p>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-2xl">📝</span>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recipe Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Grandma's Chocolate Chip Cookies"
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Origin/Cuisine
                  </label>
                  <input
                    name="origin"
                    value={form.origin}
                    onChange={handleChange}
                    placeholder="e.g., Italian, Chinese, American"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recipe Image URL
                  </label>
                  <input
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/recipe-image.jpg"
                    type="url"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-2xl">🥕</span>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ingredients</h2>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ingredients List
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Separate each ingredient with a comma (e.g., 2 cups flour, 1 tsp salt, 3 eggs)
                </p>
                <textarea
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  placeholder="2 cups all-purpose flour, 1 tsp baking soda, 1/2 cup butter, 1 cup sugar..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white resize-none"
                />
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-2xl">👨‍🍳</span>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Instructions</h2>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cooking Instructions
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Provide step-by-step cooking instructions
                </p>
                <textarea
                  name="instructions"
                  value={form.instructions}
                  onChange={handleChange}
                  placeholder="1. Preheat oven to 350°F (175°C)&#10;2. In a large bowl, mix flour and baking soda&#10;3. In another bowl, cream butter and sugar..."
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={state.loading || !form.title.trim()}
                className={`group relative px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                  state.loading || !form.title.trim()
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  {state.loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Recipe...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">✨</span>
                      <span>Create Recipe</span>
                    </>
                  )}
                </span>
                {!state.loading && !(!form.title.trim()) && (
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Your recipe will be saved and available in your dashboard once created
          </p>
        </div>
      </div>
    </div>
  );
}
