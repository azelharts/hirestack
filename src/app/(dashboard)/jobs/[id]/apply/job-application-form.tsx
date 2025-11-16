"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createJobApplicationSchema } from "@/lib/validations/job";
import { useSubmitApplication } from "@/queries/job";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/button";
import {
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Image from "next/image";
import { genderOptions, countryCodes, indonesianCities } from "@/lib/constant";
import { Database } from "@/utils/supabase/database.types";
import ToastNotification from "@/components/toast-notification";

type Job = Database["public"]["Tables"]["jobs"]["Row"];

interface JobApplicationFormProps {
  job: Job;
}

const JobApplicationForm = ({ job }: JobApplicationFormProps) => {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("+62");
  const [photoPreview, setPhotoPreview] = useState<string>(
    "/assets/images/default-avatar.png"
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [domicileSearch, setDomicileSearch] = useState("");
  const [isLinkedInValid, setIsLinkedInValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Use React Query mutation
  const submitApplicationMutation = useSubmitApplication();

  // Early return if job is not loaded
  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Create dynamic schema based on job requirements
  const schema = createJobApplicationSchema({
    fullName: job.req_full_name ?? "Off",
    photoProfile: job.req_photo_profile ?? "Off",
    gender: job.req_gender ?? "Off",
    domicile: job.req_domicile ?? "Off",
    email: job.req_email ?? "Off",
    phoneNumber: job.req_phone_number ?? "Off",
    linkedInLink: job.req_linkedin_link ?? "Off",
    dateOfBirth: job.req_date_of_birth ?? "Off",
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      jobId: job.id,
      fullName: "",
      photoUrl: "",
      gender: "",
      domicile: "",
      email: "",
      phoneNumber: "",
      linkedinUrl: "",
      dateOfBirth: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      const submissionData = {
        ...data,
        phoneNumber: data.phoneNumber
          ? `${countryCode}${data.phoneNumber}`
          : undefined,
      };
      await submitApplicationMutation.mutateAsync(submissionData);
      toast.custom((t) => (
        <ToastNotification text="Job vacancy successfully applied" t={t} />
      ));
      router.push(`/jobs/${job.id}/apply/success`);
    } catch (error) {
      toast.custom((t) => (
        <ToastNotification
          variant="error"
          text={
            error instanceof Error ? error.message : "Failed to apply to job"
          }
          t={t}
        />
      ));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        form.setValue("photoUrl", "/link-to-profile-picture.png");
      };
      reader.readAsDataURL(file);
    }
  };

  const validateLinkedInUrl = (url: string) => {
    const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
    return linkedInPattern.test(url);
  };

  const handleLinkedInChange = (value: string, onChange: any) => {
    onChange(value);
    setIsLinkedInValid(validateLinkedInUrl(value));
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const filteredCities = indonesianCities.filter((city) =>
    city.toLowerCase().includes(domicileSearch.toLowerCase())
  );

  const getCountryFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      "+62": "🇮🇩",
      "+1": "🇺🇸",
      "+44": "🇬🇧",
      "+65": "🇸🇬",
      "+60": "🇲🇾",
    };
    return flags[code] || "🌐";
  };

  const [countrySearch, setCountrySearch] = useState("");

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countryCodes;

    const search = countrySearch.toLowerCase();
    return countryCodes.filter(
      (code) =>
        code.country.toLowerCase().includes(search) ||
        code.value.includes(search)
    );
  }, [countrySearch]);

  const shouldShowField = (requirement: string | null) => {
    return requirement === "Mandatory" || requirement === "Optional";
  };

  const isFieldRequired = (requirement: string | null) => {
    return requirement === "Mandatory";
  };

  const isSubmitting = submitApplicationMutation.isPending;

  return (
    <div className="max-w-container h-full flex items-center">
      {/* Form */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-neutral-10 w-full max-w-[700px] max-h-[calc(100vh-80px)] overflow-y-auto mx-auto no-scrollbar"
      >
        <div className="flex flex-col border p-10 gap-y-6 border-neutral-40">
          {/* Header */}
          <div className="flex items-center gap-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-fit rounded-lg border p-1 bg-neutral-10 border-neutral-40 shadow-button"
            >
              <ArrowLeftIcon
                className="size-4 text-[#333333]"
                strokeWidth={3}
              />
            </button>
            <div className="flex flex-1 gap-x-4 items-center justify-between max-w-full">
              <p className="text-xl-bold text-neutral-100 flex-1 truncate">
                Apply {job.job_name} at {job.company_name}
              </p>
              <span className="text-m text-neutral-90 shrink-0 text-end">
                ℹ️ This field required to fill
              </span>
            </div>
          </div>
          <FieldGroup className="flex flex-col gap-y-4 px-6">
            {/* Photo Upload */}
            {shouldShowField(job.req_photo_profile) && (
              <Controller
                name="photoUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col gap-y-2"
                  >
                    <FieldLabel htmlFor="photo-url" className="font-bold">
                      Photo Profile
                      {isFieldRequired(job.req_photo_profile) && (
                        <span className="text-danger-main -translate-x-2 ">
                          *
                        </span>
                      )}
                    </FieldLabel>
                    <Image
                      src={photoPreview}
                      alt="Profile preview"
                      width={128}
                      height={128}
                      className="rounded-full w-32 h-32 max-w-32 max-h-32 aspect-square object-cover"
                    />
                    <div className="flex-1 relative">
                      <input
                        type="file"
                        id="photo-url"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        ref={(input) => {
                          if (input) {
                            (window as any).photoInput = input;
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="neutral"
                        size="medium"
                        className="w-fit flex items-center gap-x-1"
                        onClick={() =>
                          document.getElementById("photo-url")?.click()
                        }
                      >
                        <ArrowUpTrayIcon
                          className="size-3 text-[#111827]"
                          strokeWidth={4}
                        />
                        Take a picture
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
            {/* Full Name */}
            {shouldShowField(job.req_full_name) && (
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col gap-y-2"
                  >
                    <FieldLabel htmlFor="full-name">
                      Full Name
                      {isFieldRequired(job.req_full_name) && (
                        <span className="text-danger-main -translate-x-2">
                          *
                        </span>
                      )}
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value as string}
                      aria-invalid={fieldState.invalid}
                      id="full-name"
                      placeholder="Enter your full name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
            {/* Date of Birth */}
            {shouldShowField(job.req_date_of_birth) && (
              <Controller
                name="dateOfBirth"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col gap-y-2"
                  >
                    <FieldLabel htmlFor="dob">
                      Date of Birth
                      {isFieldRequired(job.req_date_of_birth) && (
                        <span className="text-danger-main -translate-x-2 ">
                          *
                        </span>
                      )}
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={`w-full px-3 py-2 border-2 border-neutral-40 hover:border-primary-focus transition-colors invalid:border-danger-main focus:border-primary-main rounded-lg text-left text-m flex items-center justify-between ${
                            selectedDate ? "text-black" : "text-neutral-60"
                          }`}
                        >
                          <div className="flex gap-x-3 items-center">
                            <CalendarDaysIcon className="size-4 text-neutral-100" />
                            {selectedDate
                              ? selectedDate.toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "Select your date birth"}
                          </div>
                          <ChevronDownIcon className="size-2.5 text-neutral-100" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit rounded-2xl border p-6 bg-neutral-10 border-neutral-40 shadow-modal -translate-x-24 flex flex-col gap-y-6">
                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-x-1">
                            <button
                              type="button"
                              onClick={() => setCurrentYear(currentYear - 1)}
                              className="size-6 flex items-center justify-center hover:bg-neutral-20"
                            >
                              <ChevronsLeft
                                className="size-3 text-neutral-100"
                                strokeWidth={3}
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (currentMonth === 0) {
                                  setCurrentMonth(11);
                                  setCurrentYear(currentYear - 1);
                                } else {
                                  setCurrentMonth(currentMonth - 1);
                                }
                              }}
                              className="size-6 flex items-center justify-center hover:bg-neutral-20"
                            >
                              <ChevronLeft
                                className="size-3 text-neutral-100"
                                strokeWidth={3}
                              />
                            </button>
                          </div>
                          <div className="text-m-bold text-center min-w-[140px]">
                            {monthNames[currentMonth].substring(0, 3)}{" "}
                            {currentYear}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (currentMonth === 11) {
                                setCurrentMonth(0);
                                setCurrentYear(currentYear + 1);
                              } else {
                                setCurrentMonth(currentMonth + 1);
                              }
                            }}
                            className="size-6 flex items-center justify-center hover:bg-neutral-20"
                          >
                            <ChevronRight
                              className="size-3 text-neutral-100"
                              strokeWidth={3}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrentYear(currentYear + 1)}
                            className="size-6 flex items-center justify-center hover:bg-neutral-20"
                          >
                            <ChevronsRight
                              className="size-3 text-neutral-100"
                              strokeWidth={3}
                            />
                          </button>
                        </div>
                        <div className="flex flex-col">
                          {/* Day names */}
                          <div className="grid grid-cols-7 gap-x-2 items-center justify-center">
                            {dayNames.map((day, idx) => (
                              <div
                                key={idx}
                                className="w-10 text-center text-m-bold text-neutral-100"
                              >
                                {day}
                              </div>
                            ))}
                          </div>
                          {/* Calendar days */}
                          <div className="grid grid-cols-7 gap-x-2 gap-y-2 items-center justify-center">
                            {Array.from({
                              length: getFirstDayOfMonth(
                                currentMonth,
                                currentYear
                              ),
                            }).map((_, i) => (
                              <div key={`empty-${i}`} />
                            ))}
                            {Array.from({
                              length: getDaysInMonth(currentMonth, currentYear),
                            }).map((_, i) => {
                              const day = i + 1;
                              const date = new Date(
                                currentYear,
                                currentMonth,
                                day
                              );
                              const isSelected =
                                selectedDate?.toDateString() ===
                                date.toDateString();
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDate(date);
                                    field.onChange(
                                      date.toISOString().split("T")[0]
                                    );
                                  }}
                                  className={`text-m text-neutral-90 hover:not-focus:bg-primary-surface h-6 transition-colors ${
                                    isSelected
                                      ? "bg-primary-main text-white hover:bg-primary-hover"
                                      : ""
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
            {/* Gender */}
            {shouldShowField(job.req_gender) && (
              <Controller
                name="gender"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col gap-y-2"
                  >
                    <FieldLabel htmlFor="gender">
                      Pronoun (gender)
                      {isFieldRequired(job.req_gender) && (
                        <span className="text-danger-main -translate-x-2">
                          *
                        </span>
                      )}
                    </FieldLabel>
                    <div className="flex gap-x-6">
                      {genderOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            value={option.value}
                            checked={field.value === option.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="size-5 accent-primary-main cursor-pointer"
                          />
                          <span className="text-m text-neutral-90">
                            {option.label === "Male" && "He/him (Male)"}
                            {option.label === "Female" && "She/her (Female)"}
                          </span>
                        </label>
                      ))}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
            {/* Domicile */}
            {shouldShowField(job.req_domicile) && (
              <Controller
                name="domicile"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col gap-y-2"
                  >
                    <FieldLabel htmlFor="domicile">
                      Domicile
                      {isFieldRequired(job.req_domicile) && (
                        <span className="text-danger-main -translate-x-2">
                          *
                        </span>
                      )}
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        placeholder="Choose your domicile"
                        value={domicileSearch}
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => {
                          setDomicileSearch(e.target.value);
                          setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        className=""
                      />
                      {isOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                          />
                          <div className="absolute z-50 mt-1 w-full rounded-lg border bg-neutral-10 shadow-modal ">
                            <div className="max-h-[268px] overflow-y-auto py-2">
                              {filteredCities.length > 0 ? (
                                filteredCities.map((city) => (
                                  <div
                                    key={city}
                                    className="cursor-pointer rounded-sm py-2 px-4 text-s-bold hover:bg-accent"
                                    onClick={() => {
                                      field.onChange(city);
                                      setDomicileSearch(city);
                                      setIsOpen(false);
                                    }}
                                  >
                                    {city}
                                  </div>
                                ))
                              ) : (
                                <div className="text-center text-s text-neutral-60">
                                  No city found
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
            {/* Phone Number */}
            {shouldShowField(job.req_phone_number) && (
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col gap-y-2"
                  >
                    <FieldLabel htmlFor="phone">
                      Phone Number
                      {isFieldRequired(job.req_phone_number) && (
                        <span className="text-danger-main -translate-x-2">
                          *
                        </span>
                      )}
                    </FieldLabel>
                    <div className="flex gap-x-2 items-center border-2 border-neutral-40 hover:border-primary-focus rounded-lg px-3">
                      <Select
                        value={countryCode}
                        onValueChange={(value) => {
                          setCountryCode(value);
                          setCountrySearch("");
                        }}
                      >
                        <SelectTrigger
                          iconClass="size-3"
                          className="border-none w-auto p-0 max-h-10 focus:ring-0 text-xl gap-x-1"
                        >
                          <SelectValue>
                            {getCountryFlag(countryCode)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="w-[346px] max-w-[346px] translate-x-34">
                          <div
                            className="px-2 pb-2 sticky top-0 bg-popover"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Input
                              placeholder="Search country..."
                              value={countrySearch}
                              aria-invalid={fieldState.invalid}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              onKeyDown={(e) => e.stopPropagation()}
                              className="h-9"
                            />
                          </div>
                          <div className="min-h-fit max-h-[260px] overflow-y-auto">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((code) => (
                                <SelectItem key={code.value} value={code.value}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">
                                      {getCountryFlag(code.value)}
                                    </span>
                                    <span className="font-medium flex-1">
                                      {code.country}
                                    </span>
                                    <span className="text-neutral-60">
                                      {code.value}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-2 py-6 text-center text-sm text-neutral-60">
                                No country found
                              </div>
                            )}
                          </div>
                        </SelectContent>
                      </Select>
                      <div className="w-px h-6 bg-neutral-40" />
                      <span className="text-m text-neutral-90">
                        {countryCode}
                      </span>
                      <Input
                        {...field}
                        value={field.value as string}
                        id="phone"
                        type="tel"
                        aria-invalid={fieldState.invalid}
                        placeholder="81XXXXXXXXX"
                        className="flex-1 border-none focus:ring-0 p-0"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
            {/* Email */}
            {shouldShowField(job.req_email) && (
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col gap-y-2"
                  >
                    <FieldLabel htmlFor="email">
                      Email
                      {isFieldRequired(job.req_email) && (
                        <span className="text-danger-main -translate-x-2 ">
                          *
                        </span>
                      )}
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value as string}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      type="email"
                      placeholder="your.email@example.com"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
            {/* LinkedIn URL */}
            {shouldShowField(job.req_linkedin_link) && (
              <Controller
                name="linkedinUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col gap-y-2"
                  >
                    <FieldLabel htmlFor="linkedin">
                      LinkedIn Profile
                      {isFieldRequired(job.req_linkedin_link) && (
                        <span className="text-danger-main -translate-x-2 ">
                          *
                        </span>
                      )}
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value as string}
                      id="linkedin"
                      type="url"
                      aria-invalid={fieldState.invalid}
                      placeholder="https://linkedin.com/in/yourprofile"
                      onChange={(e) =>
                        handleLinkedInChange(e.target.value, field.onChange)
                      }
                    />
                    {isLinkedInValid && (
                      <p className="text-s text-primary-main flex items-center gap-x-1">
                        <CheckCircleIcon className="size-4 text-primary-main" />{" "}
                        URL address found
                      </p>
                    )}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-0 w-full py-6 px-10 bg-neutral-10 border-t border-neutral-40">
          <Button
            type="submit"
            variant={form.formState.isValid ? "primary" : "disabled"}
            size="large"
            disabled={!form.formState.isValid || isSubmitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm;
