// app/api/jobs/[id]/applications/route.ts
import { createClient } from '@/utils/supabase/server';
import { jobApplicationSchema } from '@/lib/validations/job';
import { NextRequest, NextResponse } from 'next/server';

// GET - List applications for a job (recruiter only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the user owns this job
    const { data: job } = await supabase
      .from('jobs')
      .select('recruiter_id')
      .eq('id', params.id)
      .single();

    if (!job || job.recruiter_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        applicant:profiles!applicant_id(id, username, avatar_url)
      `)
      .eq('job_id', params.id)
      .order('applied_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ applications: data });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST - Apply to a job
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Check if already applied
    const { data: existingApplication } = await supabase
      .from('job_applications')
      .select('id')
      .eq('job_id', params.id)
      .eq('applicant_id', user.id)
      .single();

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    // Get job requirements to validate
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Basic validation
    const validation = jobApplicationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.message },
        { status: 400 }
      );
    }

    const appData = validation.data;

    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: params.id,
        applicant_id: user.id,
        full_name: appData.fullName,
        photo_url: appData.photoUrl,
        gender: appData.gender,
        domicile: appData.domicile,
        email: appData.email,
        phone_number: appData.phoneNumber,
        linkedin_url: appData.linkedinUrl,
        date_of_birth: appData.dateOfBirth,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ application: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
