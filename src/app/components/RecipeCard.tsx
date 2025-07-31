//recipe card components
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RecipeCardProps } from '../../types';

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSaveRecipe = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event bubbling
    
    if (saved || saving) return;
    
    try {
      setSaving(true);
      setError('');
      
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipe }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000); // Reset after 3 seconds
      } else {
        setError(data.error || 'Failed to save recipe');
        setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
      }
    } catch (err) {
      console.error('Error saving recipe:', err);
      setError('Network error. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="recipe-card group relative">
      <Link href={`/recipes/${recipe.idMeal}`} className="block">
        <div className="relative overflow-hidden">
          <img 
            src={recipe.strMealThumb} 
            alt={recipe.strMeal} 
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
              {recipe.strCategory}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {recipe.strMeal}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <span className="text-base">🌍</span>
              <span>{recipe.strArea}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
              <span>View Recipe</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Save Recipe Button */}
      <div className="absolute top-3 right-3">
        <button
          onClick={handleSaveRecipe}
          disabled={saving}
          className={`
            p-2 rounded-full shadow-lg transition-all duration-200
            ${saved 
              ? 'bg-green-500 text-white' 
              : saving 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-white/90 hover:bg-white text-gray-700 hover:text-red-500'
            }
            ${error ? 'bg-red-500 text-white' : ''}
          `}
          title={
            saved 
              ? 'Saved to collection' 
              : saving 
              ? 'Saving...' 
              : error 
              ? error 
              : 'Save to my collection'
          }
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : saved ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : error ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Error tooltip */}
      {error && (
        <div className="absolute top-14 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg z-10 max-w-48">
          {error}
        </div>
      )}
      
      {/* Success tooltip */}
      {saved && (
        <div className="absolute top-14 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
          Saved successfully! ✨
        </div>
      )}
    </div>
  );
}
