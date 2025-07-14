import Link from 'next/link';

export default async function RecipeDetail({ params }: { params: { id: string } }) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${params.id}`);
  const data = await res.json();
  const meal = data.meals?.[0];

  if (!meal) {
    return <div className="p-4 text-red-600">Recipe not found.</div>;
  }

  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push(`${measure?.trim()} ${ing.trim()}`);
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
