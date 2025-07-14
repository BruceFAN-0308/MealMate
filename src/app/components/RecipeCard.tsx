import Link from 'next/link';

export default function RecipeCard({ recipe }: { recipe: any }) {
  return (
    <Link href={`/recipes/${recipe.idMeal}`}>
      <div className="border rounded shadow hover:shadow-lg p-4 cursor-pointer">
        <img src={recipe.strMealThumb} alt={recipe.strMeal} className="rounded" />
        <h2 className="text-lg font-bold mt-2">{recipe.strMeal}</h2>
        <p>{recipe.strCategory} - {recipe.strArea}</p>
      </div>
    </Link>
  );
}
