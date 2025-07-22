import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, start_date, end_date, user_id } = body;

    // Validate required fields
    if (!name || !start_date || !end_date || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create meal plan
    const mealPlan = await prisma.mealPlan.create({
      data: {
        name,
        description: description || null,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        user_id,
      },
    });

    return NextResponse.json(mealPlan);
  } catch (error) {
    console.error('Error creating meal plan:', error);
    return NextResponse.json(
      { error: 'Failed to create meal plan' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const mealPlans = await prisma.mealPlan.findMany({
      where: {
        user_id,
      },
      include: {
        planned_meals: {
          include: {
            recipe: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(mealPlans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meal plans' },
      { status: 500 }
    );
  }
} 