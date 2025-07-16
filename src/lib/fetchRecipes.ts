import { MealDBResponse, MealDBRecipe } from '../types';

export const fetchRecipes = async (query: string): Promise<MealDBRecipe[]> => {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data: MealDBResponse = await res.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};
  