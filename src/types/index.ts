// External API Types (TheMealDB)
export interface MealDBResponse {
  meals: MealDBRecipe[] | null;
}

export interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate?: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  strSource?: string;
  strImageSource?: string;
  strCreativeCommonsConfirmed?: string;
  dateModified?: string;
  // Dynamic ingredients and measures (1-20)
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
  [key: string]: string | undefined;
}

export interface IngredientDBResponse {
  meals: IngredientDBItem[] | null;
}

export interface IngredientDBItem {
  idIngredient: string;
  strIngredient: string;
  strDescription?: string;
  strType?: string;
}

// Supabase Database Types
export interface SupabaseRecipe {
  id: string;
  title: string;
  category: string;
  origin: string;
  instructions: string;
  image_url: string;
  video_url?: string;
  ingredients: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateRecipeRequest {
  title: string;
  category: string;
  origin: string;
  instructions: string;
  image_url: string;
  video_url?: string;
  ingredients: string[];
}

// Form Types
export interface NewRecipeForm {
  title: string;
  category: string;
  origin: string;
  instructions: string;
  image_url: string;
  ingredients: string;
}

// Component Props Types
export interface RecipeCardProps {
  recipe: MealDBRecipe;
}

export interface SearchBarProps {
  onSearch: (term: string) => void;
}

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
}

// Page Props Types
export interface RecipeDetailPageProps {
  params: { id: string };
}

// API Response Types
export interface APIResponse<T> {
  data: T;
  error: string | null;
}

// Error Types
export interface APIError {
  message: string;
  code?: string;
}

// Loading States
export interface LoadingState {
  loading: boolean;
  error: string;
  success: string;
}

// Meal Plan Types
export interface MealPlan {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  meals: PlannedMeal[];
  created_at?: string;
  updated_at?: string;
}

export interface PlannedMeal {
  id: string;
  meal_plan_id: string;
  recipe_id: string;
  recipe?: SupabaseRecipe;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servings: number;
  notes?: string;
  created_at?: string;
}

export interface CreateMealPlanRequest {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}

export interface CreatePlannedMealRequest {
  meal_plan_id: string;
  recipe_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servings: number;
  notes?: string;
}

// Database Table Types (for Supabase)
export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: SupabaseRecipe;
        Insert: CreateRecipeRequest;
        Update: Partial<CreateRecipeRequest>;
      };
      meal_plans: {
        Row: MealPlan;
        Insert: CreateMealPlanRequest;
        Update: Partial<CreateMealPlanRequest>;
      };
      planned_meals: {
        Row: PlannedMeal;
        Insert: CreatePlannedMealRequest;
        Update: Partial<CreatePlannedMealRequest>;
      };
    };
  };
} 