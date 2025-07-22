'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import PageContainer from '../../components/PageContainer';
import Link from 'next/link';
import { MealPlan, PlannedMeal, SupabaseRecipe } from '../../../types';

export default function MealPlanDetailPage() {
  const params = useParams();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
  const [recipes, setRecipes] = useState<SupabaseRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddMealForm, setShowAddMealForm] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [newMeal, setNewMeal] = useState<{
    recipe_id: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    servings: number;
    notes: string;
  }>({
    recipe_id: '',
    meal_type: 'breakfast',
    servings: 1,
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealPlanResponse, plannedMealsResponse, recipesResponse] = await Promise.all([
          supabase.from('meal_plans').select('*').eq('id', params.id).single(),
          supabase.from('planned_meals').select('*, recipe:recipes(*)').eq('meal_plan_id', params.id),
          supabase.from('recipes').select('*')
        ]);

        if (mealPlanResponse.error) {
          console.error('Error fetching meal plan:', mealPlanResponse.error.message);
        } else {
          setMealPlan(mealPlanResponse.data);
        }

        if (plannedMealsResponse.error) {
          console.error('Error fetching planned meals:', plannedMealsResponse.error.message);
        } else {
          setPlannedMeals(plannedMealsResponse.data || []);
        }

        if (recipesResponse.error) {
          console.error('Error fetching recipes:', recipesResponse.error.message);
        } else {
          setRecipes(recipesResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const generateDates = (startDate: string, endDate: string) => {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      dates.push(new Date(current).toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const getMealsByType = (date: string, mealType: string) => {
    return plannedMeals.filter(meal => meal.date === date && meal.meal_type === mealType);
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('planned_meals')
        .insert([{
          meal_plan_id: params.id,
          date: selectedDate,
          ...newMeal
        }])
        .select('*, recipe:recipes(*)')
        .single();

      if (error) {
        console.error('Error adding meal:', error.message);
      } else {
        setPlannedMeals([...plannedMeals, data]);
        setNewMeal({ recipe_id: '', meal_type: 'breakfast', servings: 1, notes: '' });
        setShowAddMealForm(false);
        setSelectedDate('');
      }
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const deleteMeal = async (mealId: string) => {
    try {
      const { error } = await supabase
        .from('planned_meals')
        .delete()
        .eq('id', mealId);

      if (error) {
        console.error('Error deleting meal:', error.message);
      } else {
        setPlannedMeals(plannedMeals.filter(meal => meal.id !== mealId));
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const mealTypeIcons = {
    breakfast: '🥞',
    lunch: '🥗',
    dinner: '🍽️',
    snack: '🥨'
  };

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <PageContainer>
          <div className="flex justify-center items-center py-12">
            <div className="loading-spinner w-8 h-8"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading meal plan...
            </span>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <PageContainer>
          <div className="card p-12 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">❌</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Meal Plan Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The meal plan you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/meal-plans" className="btn btn-primary">
              Back to Meal Plans
            </Link>
          </div>
        </PageContainer>
      </div>
    );
  }

  const dates = generateDates(mealPlan.start_date, mealPlan.end_date);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageContainer>
        <div className="animation-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center mb-2">
                <Link
                  href="/meal-plans"
                  className="text-blue-600 hover:text-blue-700 mr-3"
                >
                  ← Back to Meal Plans
                </Link>
              </div>
              <h1 className="page-title flex items-center">
                <span className="mr-3">📅</span>
                {mealPlan.name}
              </h1>
              {mealPlan.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {mealPlan.description}
                </p>
              )}
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>
                  📅 {new Date(mealPlan.start_date).toLocaleDateString()} - {new Date(mealPlan.end_date).toLocaleDateString()}
                </span>
                <span>
                  🍽️ {plannedMeals.length} planned meals
                </span>
              </div>
            </div>
          </div>

          {/* Add Meal Form Modal */}
          {showAddMealForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Add Meal for {new Date(selectedDate).toLocaleDateString()}
                </h2>
                <form onSubmit={handleAddMeal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recipe
                    </label>
                    <select
                      value={newMeal.recipe_id}
                      onChange={(e) => setNewMeal({...newMeal, recipe_id: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select a recipe</option>
                      {recipes.map(recipe => (
                        <option key={recipe.id} value={recipe.id}>
                          {recipe.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meal Type
                    </label>
                    <select
                      value={newMeal.meal_type}
                      onChange={(e) => setNewMeal({...newMeal, meal_type: e.target.value as typeof newMeal.meal_type})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="breakfast">🥞 Breakfast</option>
                      <option value="lunch">🥗 Lunch</option>
                      <option value="dinner">🍽️ Dinner</option>
                      <option value="snack">🥨 Snack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Servings
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newMeal.servings}
                      onChange={(e) => setNewMeal({...newMeal, servings: parseInt(e.target.value)})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={newMeal.notes}
                      onChange={(e) => setNewMeal({...newMeal, notes: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                      placeholder="Any special notes or modifications..."
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddMealForm(false);
                        setSelectedDate('');
                      }}
                      className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Meal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Calendar View */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {dates.map(date => {
              const isToday = date === new Date().toISOString().split('T')[0];
              const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
              const dayNumber = new Date(date).getDate();

              return (
                <div
                  key={date}
                  className={`card p-4 min-h-[300px] ${
                    isToday ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  {/* Date Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{dayName}</div>
                      <div className={`text-lg font-semibold ${
                        isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {dayNumber}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDate(date);
                        setShowAddMealForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
                      title="Add meal"
                    >
                      ➕
                    </button>
                  </div>

                  {/* Meals */}
                  <div className="space-y-2">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                      const typeMeals = getMealsByType(date, mealType);
                      return (
                        <div key={mealType}>
                          {typeMeals.length > 0 && (
                            <div className="mb-2">
                              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium flex items-center mb-1">
                                <span className="mr-1">{mealTypeIcons[mealType as keyof typeof mealTypeIcons]}</span>
                                {mealType}
                              </div>
                              {typeMeals.map(meal => (
                                <div
                                  key={meal.id}
                                  className="group relative bg-white dark:bg-gray-800 rounded p-2 text-sm border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <Link
                                        href={`/recipes/${meal.recipe_id}`}
                                        className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium line-clamp-1"
                                      >
                                        {meal.recipe?.title || 'Unknown Recipe'}
                                      </Link>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {meal.servings} serving{meal.servings > 1 ? 's' : ''}
                                      </div>
                                      {meal.notes && (
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                          {meal.notes}
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => deleteMeal(meal.id)}
                                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 transition-all"
                                      title="Remove meal"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
