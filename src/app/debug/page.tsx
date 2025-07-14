'use client';
import { useEffect, useState } from 'react';


export default function DebugPage() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('recipes').select('*');
      if (error) console.error(error);
      else setRecipes(data);
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Recipes:</h1>
      <ul>
        {recipes.map((r: any) => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
    </div>
  );
}
