import { z } from 'zod';

const ProfileRequirementLevel = z.enum(['Mandatory', 'Optional', 'Off']);

export const jobOpeningSchema = z.object({
  jobName: z.string().min(1, 'Job name is required'),
  
  jobType: z.string().min(1, 'Job type is required'),
  
  jobDescription: z.string().min(1, 'Job description is required'),
  
  numberOfCandidatesNeeded: z.coerce.number()
  .int('Must be a whole number')
  .positive('Must be greater than 0'),
  
  jobSalary: z.object({
    minimum: z.coerce.number()
      .int('Must be a whole number')
      .nonnegative('Must be greater than 0'),
    maximum: z.coerce.number()
      .int('Must be a whole number')
      .nonnegative('Must be greater than 0'),
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
  })
});

export type JobOpening = z.infer<typeof jobOpeningSchema>;

export const validateJobOpening = (data: unknown) => {
  return jobOpeningSchema.safeParse(data);
};
