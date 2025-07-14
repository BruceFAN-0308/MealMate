export const fetchIngredients = async () => {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    const data = await res.json();
    return data.meals || [];
  };
  