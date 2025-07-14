import { NextResponse } from 'next/server';
import { supabase } from 'lib/supabase';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Recipe not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
