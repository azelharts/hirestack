import { z } from 'zod';

const ProfileRequirementLevel = z.enum(['Mandatory', 'Optional', 'Off']);

export const jobOpeningSchema = z.object({
  jobName: z.string().min(1, 'Job name is required'),
  jobType: z.string().min(1, 'Job type is required'),
  jobDescription: z.string().min(1, 'Job description is required'),
  department: z.string().optional(),
  companyName: z.string().optional(),
  numberOfCandidatesNeeded: z.coerce.number()
    .int('Must be a whole number')
    .positive('Must be greater than 0'),
  jobSalary: z.object({
    minimum: z.coerce.number()
      .int('Must be a whole number')
      .nonnegative('Must be 0 or greater'),
    maximum: z.coerce.number()
      .int('Must be a whole number')
      .nonnegative('Must be 0 or greater'),
  }).refine(
    data => data.maximum >= data.minimum,
    "Maximum salary must be greater than or equal to minimum salary"
  ),
  minimumProfileInformation: z.object({
    fullName: ProfileRequirementLevel,
    photoProfile: ProfileRequirementLevel,
    gender: ProfileRequirementLevel,
    domicile: ProfileRequirementLevel,
    email: ProfileRequirementLevel,
    phoneNumber: ProfileRequirementLevel,
    linkedInLink: ProfileRequirementLevel,
    dateOfBirth: ProfileRequirementLevel
  }),
  status: z.enum(['draft', 'active', 'inactive']).default('draft')
});

export type JobOpening = z.infer<typeof jobOpeningSchema>;

// Job application schema
export const jobApplicationSchema = z.object({
  jobId: z.string().uuid(),
  fullName: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  gender: z.enum(['male', 'female']).optional(),
  domicile: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  dateOfBirth: z.string().optional(), // ISO date string
});

export type JobApplication = z.infer<typeof jobApplicationSchema>;

// Dynamic validation based on job requirements
export function createJobApplicationSchema(jobRequirements: JobOpening['minimumProfileInformation']) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shape: any = {
    jobId: z.string().uuid(),
  };

  if (jobRequirements.fullName === 'Mandatory') {
    shape.fullName = z.string().min(1, 'Full name is required');
  } else if (jobRequirements.fullName === 'Optional') {
    shape.fullName = z.string().optional();
  }

  if (jobRequirements.photoProfile === 'Mandatory') {
    shape.photoUrl = z.string('Photo profile is required').min(1, "Photo profile is required");
  } else if (jobRequirements.photoProfile === 'Optional') {
    shape.photoUrl = z.string().url().optional().or(z.literal(''));
  }

  if (jobRequirements.gender === 'Mandatory') {
    shape.gender = z.enum(['male', 'female'], "Gender is required");
  } else if (jobRequirements.gender === 'Optional') {
    shape.gender = z.enum(['male', 'female'], "Gender is required").optional();
  }

  if (jobRequirements.domicile === 'Mandatory') {
    shape.domicile = z.string().min(1, 'Domicile is required');
  } else if (jobRequirements.domicile === 'Optional') {
    shape.domicile = z.string().optional();
  }

  if (jobRequirements.email === 'Mandatory') {
    shape.email = z.string().email('Make sure your email address is correct (eg: name@domain.com)').min(1, "Email is required");
  } else if (jobRequirements.email === 'Optional') {
    shape.email = z.string().email().optional().or(z.literal(''));
  }

  if (jobRequirements.phoneNumber === 'Mandatory') {
    shape.phoneNumber = z.string().min(1, 'Phone number is required');
  } else if (jobRequirements.phoneNumber === 'Optional') {
    shape.phoneNumber = z.string().optional();
  }

  if (jobRequirements.linkedInLink === 'Mandatory') {
    shape.linkedinUrl = z.string().min(25, "Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile").startsWith("https://linkedin.com/in/").url('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)').min(1, "Linkedin url is required");
  } else if (jobRequirements.linkedInLink === 'Optional') {
    shape.linkedinUrl = z.string().url().optional().or(z.literal(''));
  }

  if (jobRequirements.dateOfBirth === 'Mandatory') {
    shape.dateOfBirth = z.string().min(1, 'Date of birth is required');
  } else if (jobRequirements.dateOfBirth === 'Optional') {
    shape.dateOfBirth = z.string().optional();
  }

  return z.object(shape);
}