// app/api/jobs/[id]/route.ts
import { createClient } from '@/utils/supabase/server';
import { jobOpeningSchema } from '@/lib/validations/job';
import { NextRequest, NextResponse } from 'next/server';

// GET - Get single job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        recruiter:profiles!recruiter_id(full_name, avatar_url, company_name)
      `)
      .eq('id', params.id)
      .single();

    if (error) throw error;

    return NextResponse.json({ job: data });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
  }
}

// PATCH - Update job
export async function PATCH(
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
    const validation = jobOpeningSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.message },
        { status: 400 }
      );
    }

    const jobData = validation.data;
    const updateData: any = {};

    if (jobData.jobName) updateData.job_name = jobData.jobName;
    if (jobData.jobType) updateData.job_type = jobData.jobType;
    if (jobData.jobDescription) updateData.job_description = jobData.jobDescription;
    if (jobData.department !== undefined) updateData.department = jobData.department;
    if (jobData.companyName !== undefined) updateData.company_name = jobData.companyName;
    if (jobData.numberOfCandidatesNeeded) updateData.number_of_candidates_needed = jobData.numberOfCandidatesNeeded;
    if (jobData.status) updateData.status = jobData.status;
    
    if (jobData.jobSalary) {
      updateData.salary_min = jobData.jobSalary.minimum;
      updateData.salary_max = jobData.jobSalary.maximum;
    }
    
    if (jobData.minimumProfileInformation) {
      const reqs = jobData.minimumProfileInformation;
      if (reqs.fullName) updateData.req_full_name = reqs.fullName;
      if (reqs.photoProfile) updateData.req_photo_profile = reqs.photoProfile;
      if (reqs.gender) updateData.req_gender = reqs.gender;
      if (reqs.domicile) updateData.req_domicile = reqs.domicile;
      if (reqs.email) updateData.req_email = reqs.email;
      if (reqs.phoneNumber) updateData.req_phone_number = reqs.phoneNumber;
      if (reqs.linkedInLink) updateData.req_linkedin_link = reqs.linkedInLink;
      if (reqs.dateOfBirth) updateData.req_date_of_birth = reqs.dateOfBirth;
    }

    const { data, error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', params.id)
      .eq('recruiter_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ job: data });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE - Delete job
export async function DELETE(
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

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', params.id)
      .eq('recruiter_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}