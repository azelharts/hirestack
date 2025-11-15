export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      job_applications: {
        Row: {
          applicant_id: string
          applied_at: string
          date_of_birth: string | null
          domicile: string | null
          email: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          job_id: string
          linkedin_url: string | null
          phone_number: string | null
          photo_url: string | null
        }
        Insert: {
          applicant_id: string
          applied_at?: string
          date_of_birth?: string | null
          domicile?: string | null
          email?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          job_id: string
          linkedin_url?: string | null
          phone_number?: string | null
          photo_url?: string | null
        }
        Update: {
          applicant_id?: string
          applied_at?: string
          date_of_birth?: string | null
          domicile?: string | null
          email?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          job_id?: string
          linkedin_url?: string | null
          phone_number?: string | null
          photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company_name: string | null
          created_at: string
          department: string | null
          id: string
          job_description: string
          job_name: string
          job_type: string
          number_of_candidates_needed: number
          recruiter_id: string
          req_date_of_birth:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_domicile:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_email: Database["public"]["Enums"]["profile_requirement"] | null
          req_full_name:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_gender: Database["public"]["Enums"]["profile_requirement"] | null
          req_linkedin_link:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_phone_number:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_photo_profile:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          salary_max: number
          salary_min: number
          status: Database["public"]["Enums"]["job_status"] | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          department?: string | null
          id?: string
          job_description: string
          job_name: string
          job_type: string
          number_of_candidates_needed?: number
          recruiter_id: string
          req_date_of_birth?:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_domicile?:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_email?: Database["public"]["Enums"]["profile_requirement"] | null
          req_full_name?:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_gender?: Database["public"]["Enums"]["profile_requirement"] | null
          req_linkedin_link?:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_phone_number?:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_photo_profile?:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          salary_max?: number
          salary_min?: number
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          department?: string | null
          id?: string
          job_description?: string
          job_name?: string
          job_type?: string
          number_of_candidates_needed?: number
          recruiter_id?: string
          req_date_of_birth?:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_domicile?:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_email?: Database["public"]["Enums"]["profile_requirement"] | null
          req_full_name?:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_gender?: Database["public"]["Enums"]["profile_requirement"] | null
          req_linkedin_link?:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_phone_number?:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          req_photo_profile?:
            | Database["public"]["Enums"]["profile_requirement"]
            | null
          salary_max?: number
          salary_min?: number
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          date_of_birth: string | null
          domicile: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          linkedin_url: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          date_of_birth?: string | null
          domicile?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id: string
          linkedin_url?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          date_of_birth?: string | null
          domicile?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          linkedin_url?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_job_stats: { Args: { job_id_param: string }; Returns: Json }
    }
    Enums: {
      gender_type: "male" | "female"
      job_status: "draft" | "active" | "inactive"
      profile_requirement: "Mandatory" | "Optional" | "Off"
      user_role: "recruiter" | "job_seeker"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gender_type: ["male", "female"],
      job_status: ["draft", "active", "inactive"],
      profile_requirement: ["Mandatory", "Optional", "Off"],
      user_role: ["recruiter", "job_seeker"],
    },
  },
} as const
