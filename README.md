# Hirestack

## 📄 Project Overview

This is a complete **Job Recruitment Platform** featuring two user roles:

- **Recruiters** — create, edit, publish, and manage job postings
- **Job Seekers** — browse job listings and submit job applications

---

### 🗄️ Database Schema

![Database Schema](https://drive.google.com/file/d/12gZ5v8p_AFwauYj9TMsKJaxzbYrELi7-/view?usp=sharing)

---

### 📁 Project Structure

```
/app
  /api
    /auth
      /confitm
        route.ts                  # confirm magic link
      /signout
        route.ts                  # Signout
  /(dashboard)
    /recruiter
        page.tsx                  # Recruiter dashboard
    /jobs
      /[id]
        /apply
          page.tsx                # Application form page
          /success
            page.tsx              # Success page
    /job-seeker
      page.tsx                    # Job seeker dashboard
/components
  /ui                             # existing UI components
/lib
  /validations
    job.ts                        # Zod schemas
    auth.ts                       # Zod schemas
  constant.ts                     # Constants & data
  utils.ts                        # Utility functions
/utils
  /supabase                       # Supabase setup
```

## 🧑‍💻 Tech Stack Used

- Next.js 15 – App Router–based full-stack React framework powering routing, server actions, and SSR.
- React 19 – Core frontend library for building UI components.
- TailwindCSS 4 – Utility-first CSS framework for styling the UI.
- Shadcn/UI (Radix + Tailwind) – Accessible, unstyled components used for building custom UI elements.
- Supabase (Auth, DB) – Backend database, authentication, and storage layer for the app.
- React Hook Form – Lightweight form state manager for building performant forms.
- Zod – Validation library for strongly typed schemas on both client & server.
- React Query (TanStack) – Client-side data fetching, caching & state management.
- Heroicons / Lucide React – Icon libraries used for UI icons.
- Sonner – Toast notification library for alerts & messages.
- Class Variance Authority (CVA) – Utility for managing Tailwind variants in components.
- Tailwind Merge – Utility for merging conflicting Tailwind class names.
- ESLint, Prettier, TypeScript – Code quality and static typing tools.

## 🛜 How To Run Locally

```
git clone https://github.com/azelharts/hirestack.git
```

```
npm install
```

Next? setup supabase. Go to your supabase dashboard, create a new project, go to your project api key and copy it to your .env file.

```
NEXT_PUBLIC_SITE_URL=https://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=""

# Legacy API Keys
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=""
```

Next? you need to create your schema & be authenticated to your supabase account & project through supabase CLI to automatically generate TypeScript types for you.

```
npx supabase login
npx supabase init
npx supabase link
npx supabase gen types typescript --linked --schema=public > src/utils/supabase/database.types.ts
```

Finally run the project.

```
npm run dev
```
