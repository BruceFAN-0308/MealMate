'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import PageContainer from '../components/PageContainer';
import { MealPlan, SupabaseRecipe } from '../../types';

export default function MealPlansPage() {
  const { user, isLoaded } = useUser();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [recipes, setRecipes] = useState<SupabaseRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch meal plans and recipes
        const [mealPlansResponse, recipesResponse] = await Promise.all([
          fetch(`/api/meal-plans?user_id=${user.id}`),
          supabase.from('recipes').select('*')
        ]);

        // Handle meal plans response
        if (mealPlansResponse.ok) {
          const mealPlansData = await mealPlansResponse.json();
          setMealPlans(mealPlansData || []);
        } else {
          const errorText = await mealPlansResponse.text();
          console.error('Error fetching meal plans:', errorText);
          if (errorText.includes('relation') || errorText.includes('does not exist')) {
            setError('数据库表未创建。请运行: npm run db:setup');
            console.log('🔧 数据库设置需要运行: npm run db:setup');
          } else {
            setError(`加载餐食计划失败: ${errorText}`);
          }
        }

        // Handle recipes response  
        if (recipesResponse.error) {
          console.error('Error fetching recipes:', recipesResponse.error.message);
        } else {
          setRecipes(recipesResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, user]);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch('/api/meal-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPlan,
          user_id: user.id,
        }),
      });

      if (response.ok) {
        const newMealPlan = await response.json();
        setMealPlans([...mealPlans, newMealPlan]);
        setNewPlan({ name: '', description: '', start_date: '', end_date: '' });
        setShowCreateForm(false);
      } else {
        const errorData = await response.json();
        setError(`Error creating meal plan: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating meal plan:', error);
      setError('Failed to create meal plan. Please try again.');
    }
  };

  const getWeekNumber = (date: string) => {
    const d = new Date(date);
    const firstDay = new Date(d.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((d.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageContainer>
        <div className="animation-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="page-title flex items-center">
                <span className="mr-3">📅</span>
                Meal Plans
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Plan your weekly meals and stay organized with your cooking schedule
              </p>
            </div>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary btn-lg"
            >
              <span className="mr-2">➕</span>
              Create New Plan
            </button>
          </div>

          {/* Create Form Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Create New Meal Plan
                </h2>
                <form onSubmit={handleCreatePlan} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Weekly Family Meal Plan"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={newPlan.description}
                      onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                      placeholder="Brief description of your meal plan..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={newPlan.start_date}
                        onChange={(e) => setNewPlan({...newPlan, start_date: e.target.value})}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={newPlan.end_date}
                        onChange={(e) => setNewPlan({...newPlan, end_date: e.target.value})}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Plan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <span className="mr-2">❌</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Authentication Check */}
          {!isLoaded ? (
            <div className="flex justify-center items-center py-12">
              <div className="loading-spinner w-8 h-8"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Loading...
              </span>
            </div>
          ) : !user ? (
            <div className="card p-12 text-center max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🔐</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Please Sign In
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You need to sign in to create and manage your meal plans.
              </p>
              <div className="flex gap-3 justify-center">
                <button className="btn btn-primary">
                  Sign In
                </button>
                <button className="btn btn-outline">
                  Sign Up
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="loading-spinner w-8 h-8"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Loading your meal plans...
              </span>
            </div>
          ) : mealPlans.length === 0 ? (
            <div className="card p-12 text-center max-w-2xl mx-auto">
              <div className="text-6xl mb-6">📅</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                No meal plans yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start planning your meals for the week! Create your first meal plan to organize your cooking schedule and make grocery shopping easier.
              </p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary btn-lg"
              >
                <span className="mr-2">➕</span>
                Create Your First Meal Plan
              </button>
            </div>
          ) : (
            <div className="animation-slide-up">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {mealPlans.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Plans
                  </div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {mealPlans.filter(plan => new Date(plan.end_date) >= new Date()).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Active Plans
                  </div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {recipes.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Available Recipes
                  </div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {mealPlans.reduce((total, plan) => total + (plan.meals?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Planned Meals
                  </div>
                </div>
              </div>

              {/* Meal Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mealPlans.map(plan => {
                  const isActive = new Date(plan.end_date) >= new Date();
                  const daysDiff = Math.ceil((new Date(plan.end_date).getTime() - new Date(plan.start_date).getTime()) / (1000 * 3600 * 24)) + 1;
                  
                  return (
                    <Link
                      key={plan.id}
                      href={`/meal-plans/${plan.id}`}
                      className="card p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {plan.name}
                          </h3>
                          {plan.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {plan.description}
                            </p>
                          )}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {isActive ? 'Active' : 'Completed'}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <span className="mr-2">📅</span>
                          <span>
                            {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">⏱️</span>
                          <span>{daysDiff} days</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">🍽️</span>
                          <span>{plan.meals?.length || 0} planned meals</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            Week {getWeekNumber(plan.start_date)}
                          </span>
                          <span className="text-blue-600 dark:text-blue-400 group-hover:underline">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
} 