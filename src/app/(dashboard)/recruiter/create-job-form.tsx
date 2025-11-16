"use client";

import { jobOpeningSchema } from "@/lib/validations/job";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { XMarkIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/button";
import ToastNotification from "@/components/toast-notification";
import { jobTypes, profileFields } from "@/lib/constant";
import { useCreateJob } from "@/queries/job";

const CreateJobForm = () => {
  const form = useForm<z.infer<typeof jobOpeningSchema>>({
    // @ts-expect-error ignore for now
    resolver: zodResolver(jobOpeningSchema),
    defaultValues: {
      jobName: "",
      jobType: "",
      jobDescription: "",
      department: "",
      companyName: "Rakamin",
      numberOfCandidatesNeeded: 1,
      jobSalary: {
        // @ts-expect-error ignore for now
        minimum: "",
        // @ts-expect-error ignore for now
        maximum: "",
      },
      minimumProfileInformation: {
        fullName: "Mandatory",
        photoProfile: "Mandatory",
        gender: "Mandatory",
        domicile: "Mandatory",
        email: "Mandatory",
        phoneNumber: "Mandatory",
        linkedInLink: "Mandatory",
        dateOfBirth: "Mandatory",
      },
      status: "draft",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const createJob = useCreateJob();
  const onSubmit = async (
    data: z.infer<typeof jobOpeningSchema>,
    status: "draft" | "active",
  ) => {
    createJob.mutate(
      { ...data, status },
      {
        onSuccess: () => {
          form.reset();
          toast.custom((t) => (
            <ToastNotification text="Job vacancy successfully created" t={t} />
          ));
        },

        onError: (error) => {
          toast.custom((t) => (
            <ToastNotification
              variant="error"
              text={
                error instanceof Error ? error.message : "Failed to update job"
              }
              t={t}
            />
          ));
        },
      },
    );
  };

  return (
    <DialogContent
      showCloseButton={false}
      className="no-scrollbar h-[780px] min-w-[900px]"
    >
      <DialogHeader className="hidden">
        <DialogTitle className="text-xl-bold text-neutral-100">
          Job Opening
        </DialogTitle>
      </DialogHeader>

      {/* @ts-expect-error ignore for now */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full w-full">
        {/* Form Header */}
        <div className="bg-neutral-10 border-neutral-40 sticky top-0 left-0 z-50 flex w-full items-start justify-between gap-y-2 border-b p-6">
          <p className="text-xl-bold text-neutral-100">Job Opening</p>
          <DialogClose asChild>
            <button type="button">
              <XMarkIcon className="text-neutral-90 h-6 w-6" />
            </button>
          </DialogClose>
        </div>

        {/* Form Content */}
        <FieldGroup className="flex=col flex gap-y-6 px-6 py-4">
          {/* Job Name */}
          <Controller
            name="jobName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col gap-y-2"
              >
                <FieldLabel htmlFor="job-name">
                  Job Name
                  <span className="text-s text-danger-main -translate-x-2">
                    *
                  </span>
                </FieldLabel>
                <Input
                  {...field}
                  id="job-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Ex. Front End Engineer"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Job Type */}
          <Controller
            name="jobType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col gap-y-2"
              >
                <FieldLabel htmlFor="job-type">
                  Job Type
                  <span className="text-s text-danger-main -translate-x-2">
                    *
                  </span>
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Department & Company Name */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="department"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="flex flex-col gap-y-2">
                  <FieldLabel htmlFor="department">Department</FieldLabel>
                  <Input
                    {...field}
                    id="department"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ex. Engineering"
                  />
                </Field>
              )}
            />
            <Controller
              name="companyName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="flex flex-col gap-y-2">
                  <FieldLabel htmlFor="company">Company Name</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="company"
                    placeholder="Ex. Videfly"
                  />
                </Field>
              )}
            />
          </div>

          {/* Job Description */}
          <Controller
            name="jobDescription"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col gap-y-2"
              >
                <FieldLabel htmlFor="job-description">
                  Job Description
                  <span className="text-s text-danger-main -translate-x-2">
                    *
                  </span>
                </FieldLabel>
                <Textarea
                  {...field}
                  id="job-description"
                  aria-invalid={fieldState.invalid}
                  placeholder="Ex."
                  rows={6}
                  className="min-h-[88px] resize-none"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Number of Candidates Needed */}
          <Controller
            name="numberOfCandidatesNeeded"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col gap-y-2"
              >
                <FieldLabel htmlFor="candidates-needed">
                  Number of Candidate Needed
                  <span className="text-s -translate-x-2 text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  type="number"
                  id="candidates-needed"
                  min={1}
                  aria-invalid={fieldState.invalid}
                  placeholder="Ex. 2"
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Job Salary */}
          <FieldSet className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-6">
              <div className="dashed-border h-px w-full opacity-25" />
              <p className="text-s text-neutral-90">Job Salary</p>
            </div>
            <div className="flex items-center gap-x-4">
              <Controller
                name="jobSalary.minimum"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="relative">
                    <FieldLabel htmlFor="salary-min">
                      Minimum Estimated Salary
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id="salary-min"
                      aria-invalid={fieldState.invalid}
                      placeholder="7.000.000"
                      className="pl-[37px]"
                      min={0}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                    <span className="text-m-bold absolute top-9 left-[18px] max-w-fit">
                      Rp
                    </span>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <div className="bg-neutral-40 mt-7 h-px min-w-4" />
              <Controller
                name="jobSalary.maximum"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="relative">
                    <FieldLabel htmlFor="salary-max">
                      Maximum Estimated Salary
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id="salary-max"
                      aria-invalid={fieldState.invalid}
                      placeholder="8.000.000"
                      className="pl-[37px]"
                      min={0}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                    <span className="text-m-bold absolute top-9 left-[18px] max-w-fit">
                      Rp
                    </span>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldSet>

          {/* Minimum Profile */}
          <FieldSet className="border-neutral-30 flex flex-col gap-y-4 rounded-lg border p-4">
            <p className="text-m-bold text-neutral-90">
              Minimum Profile Information Required
            </p>

            <div className="flex flex-col gap-y-2 p-2">
              {profileFields.map((profileField, profileIndex) => (
                <div
                  key={profileField.name}
                  className="flex flex-col items-center justify-between gap-y-2"
                >
                  <div className="flex w-full items-center justify-between p-2">
                    <span className="text-m text-neutral-90">
                      {profileField.label}
                    </span>
                    <Controller
                      // @ts-expect-error ignore for now
                      name={`minimumProfileInformation.${profileField.name}`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex gap-2">
                          {["Mandatory", "Optional", "Off"].map(
                            (level, mandatoryIndex) => (
                              <button
                                key={level}
                                type="button"
                                disabled={
                                  (profileIndex === 0 ||
                                    profileIndex === 1 ||
                                    profileIndex === 4) &&
                                  (mandatoryIndex === 1 || mandatoryIndex === 2)
                                }
                                onClick={() => field.onChange(level)}
                                className={`text-m disabled:bg-neutral-30 disabled:border-neutral-40 disabled:text-neutral-60 rounded-2xl border px-3 py-1 transition-all disabled:pointer-events-none ${
                                  field.value === level
                                    ? level === "Mandatory"
                                      ? "text-primary-main border-primary-main"
                                      : level === "Optional"
                                        ? "text-primary-main border-primary-main"
                                        : "text-primary-main border-primary-main"
                                    : "bg-neutral-10 text-neutral-90"
                                }`}
                              >
                                {level}
                              </button>
                            ),
                          )}
                        </div>
                      )}
                    />
                  </div>

                  {/* Separator */}
                  <div className="bg-neutral-40 h-px w-full" />
                </div>
              ))}
            </div>
          </FieldSet>
        </FieldGroup>

        {/* Form Footer */}
        <div
          // @ts-expect-error ignore for now
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-neutral-10 border-neutral-40 sticky bottom-0 left-0 z-50 flex w-full justify-end gap-x-2 gap-y-2 border-t p-6"
        >
          <Button
            type="button"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            variant={form.formState.isValid ? "neutral" : "disabled"}
            size="medium"
            className="w-fit!"
            // @ts-expect-error ignore for now
            onClick={form.handleSubmit((data) => onSubmit(data, "draft"))}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            variant={form.formState.isValid ? "primary" : "disabled"}
            size="medium"
            className="w-fit!"
            // @ts-expect-error ignore for now
            onClick={form.handleSubmit((data) => onSubmit(data, "active"))}
          >
            Publish Job
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default CreateJobForm;
