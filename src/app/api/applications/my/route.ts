// app/api/applications/my/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get user's applications
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        job:jobs(
          id,
          job_name,
          job_type,
          company_name,
          salary_min,
          salary_max,
          status
        )
      `)
      .eq('applicant_id', user.id)
      .order('applied_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ applications: data });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}