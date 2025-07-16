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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
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
        error: '❌ Failed to create recipe. Please try again.' 
      }));
    } else {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: '✅ Recipe created successfully!' 
      }));
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🍽️ Add New Recipe</h1>

      {state.error && (
        <p className="bg-red-100 text-red-800 p-2 rounded mb-4">{state.error}</p>
      )}
      {state.success && (
        <p className="bg-green-100 text-green-800 p-2 rounded mb-4">{state.success}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'title', placeholder: 'Title', required: true },
          { name: 'category', placeholder: 'Category' },
          { name: 'origin', placeholder: 'Origin' },
          { name: 'image_url', placeholder: 'Image URL' },
        ].map(field => (
          <input
            key={field.name}
            name={field.name}
            value={form[field.name as keyof NewRecipeForm]}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}

        <textarea
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
          placeholder="Instructions"
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />

        <textarea
          name="ingredients"
          value={form.ingredients}
          onChange={handleChange}
          placeholder="Ingredients (comma-separated)"
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />

        <button
          type="submit"
          disabled={state.loading}
          className={`w-full py-3 text-white font-semibold rounded ${
            state.loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {state.loading ? 'Submitting...' : '➕ Create Recipe'}
        </button>
      </form>
    </div>
  );
}
