// queries/job.ts
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/utils/supabase/database.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


type Job = Database['public']['Tables']['jobs']['Row'];
type JobUpdate = Database['public']['Tables']['jobs']['Update'];

// Query Keys
export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (filters: string) => [...jobKeys.lists(), { filters }] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
  applications: (jobId: string) => [...jobKeys.all, 'applications', jobId] as const,
};

// ============================================
// FETCH ALL JOBS (with optional filters)
// ============================================
export function useJobs(params?: {
  status?: string;
  search?: string;
  myJobs?: boolean;
}) {
  const supabase = createClient();

  return useQuery({
    queryKey: jobKeys.list(JSON.stringify(params || {})),
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          recruiter:profiles!recruiter_id(full_name, avatar_url),
          application_count:job_applications(count)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (params?.myJobs) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('recruiter_id', user.id);
        }
      } else {
        // Public view: only show active jobs
        query = query.eq('status', 'active');
      }

      if (params?.status && params?.myJobs) {
        query = query.eq('status', params.status as "draft" | "active" | "inactive");
      }

      if (params?.search) {
        query = query.or(`job_name.ilike.%${params.search}%,job_description.ilike.%${params.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Job[];
    },
  });
}

// ============================================
// FETCH SINGLE JOB
// ============================================
export function useJob(jobId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: jobKeys.detail(jobId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          recruiter:profiles!recruiter_id(full_name, avatar_url)
        `)
        .eq('id', jobId)
        .single();

      if (error) throw error;
      return data as Job;
    },
    enabled: !!jobId,
  });
}

// ============================================
// CREATE JOB MUTATION
// ============================================
export function useCreateJob() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (jobData: {
      jobName: string;
      jobType: string;
      jobDescription: string;
      department?: string;
      companyName?: string;
      numberOfCandidatesNeeded: number;
      jobSalary: { minimum: number; maximum: number };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      minimumProfileInformation: any;
      status: 'draft' | 'active' | 'inactive';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

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
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

// ============================================
// UPDATE JOB MUTATION
// ============================================
export function useUpdateJob() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ jobId, updates }: { jobId: string; updates: Partial<JobUpdate> }) => {
      const { data, error } = await supabase
        .from("jobs")
        .update(updates)
        .eq("id", jobId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
    },    
  });
}


// ============================================
// DELETE JOB MUTATION
// ============================================
export function useDeleteJob() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

// ============================================
// FETCH JOB APPLICATIONS
// ============================================
export function useJobApplications(jobId: string, params: {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  phoneFilter?: string;
  genderFilter?: string;
  domicileFilter?: string;
  dateFilter?: string;
}) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['job-applications', jobId, params],
    queryFn: async () => {
      let query = supabase
        .from('job_applications')
        .select('*', { count: 'exact' })
        .eq('job_id', jobId);

      // Apply filters
      if (params.phoneFilter && params.phoneFilter !== 'all') {
        query = query.ilike('phone_number', `${params.phoneFilter}%`);
      }
      
      if (params.genderFilter && params.genderFilter !== 'all') {
        query = query.eq('gender', params.genderFilter as "male" | "female");
      }
      
      if (params.domicileFilter && params.domicileFilter !== 'all') {
        query = query.eq('domicile', params.domicileFilter);
      }
      
      if (params.dateFilter && params.dateFilter !== 'all') {
        const now = new Date();
        const filterDate = new Date();
        
        if (params.dateFilter === '24h') {
          filterDate.setHours(now.getHours() - 24);
        } else if (params.dateFilter === '1w') {
          filterDate.setDate(now.getDate() - 7);
        } else if (params.dateFilter === '1m') {
          filterDate.setMonth(now.getMonth() - 1);
        }
        
        query = query.gte('applied_at', filterDate.toISOString());
      }

      // Apply sorting
      query = query.order(params.sortBy, { ascending: params.sortOrder === 'asc' });

      // Apply pagination
      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        applications: data,
        total: count || 0,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil((count || 0) / params.pageSize),
      };
    },
    enabled: !!jobId,
  });
}

// ============================================
// SUBMIT APPLICATION MUTATION
// ============================================
export function useSubmitApplication() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (applicationData: {
      jobId: string;
      fullName?: string;
      photoUrl?: string;
      gender?: string;
      domicile?: string;
      email?: string;
      phoneNumber?: string;
      linkedinUrl?: string;
      dateOfBirth?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if already applied
      const { data: existingApp } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', applicationData.jobId)
        .eq('applicant_id', user.id)
        .single();

      if (existingApp) {
        throw new Error('You have already applied to this job');
      }

      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          job_id: applicationData.jobId,
          applicant_id: user.id,
          full_name: applicationData.fullName,
          photo_url: applicationData.photoUrl,
          gender: applicationData.gender as "male" | "female",
          domicile: applicationData.domicile,
          email: applicationData.email,
          phone_number: applicationData.phoneNumber,
          linkedin_url: applicationData.linkedinUrl,
          date_of_birth: applicationData.dateOfBirth,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: jobKeys.applications(variables.jobId) 
      });
    },
  });
}

// ============================================
// GET MY APPLICATIONS
// ============================================
export function useMyApplications() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

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
      return data;
    },
  });
}