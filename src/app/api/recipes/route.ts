import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { MealDBRecipe } from '../../../types';

function convertMealDBToSupabase(mealDBRecipe: MealDBRecipe) {
  const ingredients: string[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = mealDBRecipe[`strIngredient${i}` as keyof MealDBRecipe];
    const measure = mealDBRecipe[`strMeasure${i}` as keyof MealDBRecipe];

    if (ingredient && ingredient.trim()) {
      const measureText = measure && measure.trim() ? `${measure.trim()} ` : '';
      ingredients.push(`${measureText}${ingredient.trim()}`);
    }
  }

  return {
    title: mealDBRecipe.strMeal,
    category: mealDBRecipe.strCategory,
    origin: mealDBRecipe.strArea,
    instructions: mealDBRecipe.strInstructions,
    image_url: mealDBRecipe.strMealThumb,
    video_url: mealDBRecipe.strYoutube || undefined,
    ingredients: ingredients
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipe }: { recipe: MealDBRecipe } = body;

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe data is required' },
        { status: 400 }
      );
    }

    // 转换格式
    const supabaseRecipe = convertMealDBToSupabase(recipe);

    // 检查是否已经保存过这个食谱（基于title和category）
    const { data: existingRecipe } = await supabase
      .from('recipes')
      .select('id')
      .eq('title', supabaseRecipe.title)
      .eq('category', supabaseRecipe.category)
      .single();

    if (existingRecipe) {
      return NextResponse.json(
        { error: 'This recipe is already in your collection' },
        { status: 409 }
      );
    }

    // 保存到数据库
    const { data, error } = await supabase
      .from('recipes')
      .insert([supabaseRecipe])
      .select()
      .single();

    if (error) {
      console.error('Error saving recipe:', error);
      return NextResponse.json(
        { error: 'Failed to save recipe' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Recipe saved successfully',
      recipe: data
    });

  } catch (error) {
    console.error('Error in POST /api/recipes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Recipe ID is required' },
        { status: 400 }
      );
    }

    // 删除菜谱
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting recipe:', error);
      return NextResponse.json(
        { error: 'Failed to delete recipe' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Recipe deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/recipes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
