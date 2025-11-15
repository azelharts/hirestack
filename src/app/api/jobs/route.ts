// app/api/jobs/route.ts
import { createClient } from '@/utils/supabase/server';
import { jobOpeningSchema } from '@/lib/validations/job';
import { type NextRequest, NextResponse } from 'next/server';

// GET - List all jobs (with filters)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as "draft" | "active" | "inactive";
    const search = searchParams.get('search');
    const myJobs = searchParams.get('myJobs') === 'true';

    let query = supabase
      .from('jobs')
      .select(`
        *,
        recruiter:profiles!recruiter_id(full_name, avatar_url, company_name),
        application_count:job_applications(count)
      `)
      .order('created_at', { ascending: false });

    // Filter by recruiter's own jobs
    if (myJobs && user) {
      query = query.eq('recruiter_id', user.id);
    } else {
      // Public view: only show active jobs
      query = query.eq('status', 'active');
    }

    // Filter by status
    if (status && myJobs) {
      query = query.eq('status', status);
    }

    // Search filter
    if (search) {
      query = query.or(`job_name.ilike.%${search}%,job_description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ jobs: data });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST - Create new job
export async function POST(request: NextRequest) {
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
    const validation = jobOpeningSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.message },
        { status: 400 }
      );
    }

    const jobData = validation.data;

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        recruiter_id: user.id,
        job_name: jobData.jobName,
        job_type: jobData.jobType,
        job_description: jobData.jobDescription,
        department: jobData.department,
        company_name: jobData.companyName,
        number_of_candidates_needed: jobData.numberOfCandidatesNeeded,
        salary_min: jobData.jobSalary.minimum,
        salary_max: jobData.jobSalary.maximum,
        status: jobData.status || 'draft',
        req_full_name: jobData.minimumProfileInformation.fullName,
        req_photo_profile: jobData.minimumProfileInformation.photoProfile,
        req_gender: jobData.minimumProfileInformation.gender,
        req_domicile: jobData.minimumProfileInformation.domicile,
        req_email: jobData.minimumProfileInformation.email,
        req_phone_number: jobData.minimumProfileInformation.phoneNumber,
        req_linkedin_link: jobData.minimumProfileInformation.linkedInLink,
        req_date_of_birth: jobData.minimumProfileInformation.dateOfBirth,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ job: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

