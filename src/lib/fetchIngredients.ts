import { IngredientDBResponse, IngredientDBItem } from '../types';

export const fetchIngredients = async (): Promise<IngredientDBItem[]> => {
  try {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data: IngredientDBResponse = await res.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return [];
  }
};
  