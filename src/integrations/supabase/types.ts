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
      custom_metrics: {
        Row: {
          created_at: string
          definition: Json
          id: string
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          definition?: Json
          id?: string
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          definition?: Json
          id?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          metadata: Json | null
          project_id: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dashboards_settings: {
        Row: {
          created_at: string
          id: string
          layout: Json
          preferences: Json
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          layout?: Json
          preferences?: Json
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          layout?: Json
          preferences?: Json
          project_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_snapshots: {
        Row: {
          conversion: number | null
          created_at: string
          id: string
          investimento: number | null
          leads: number | null
          metrics_data: Json | null
          project_id: string
          revenue: number | null
          roi: number | null
          snapshot_date: string
          ticket: number | null
        }
        Insert: {
          conversion?: number | null
          created_at?: string
          id?: string
          investimento?: number | null
          leads?: number | null
          metrics_data?: Json | null
          project_id: string
          revenue?: number | null
          roi?: number | null
          snapshot_date: string
          ticket?: number | null
        }
        Update: {
          conversion?: number | null
          created_at?: string
          id?: string
          investimento?: number | null
          leads?: number | null
          metrics_data?: Json | null
          project_id?: string
          revenue?: number | null
          roi?: number | null
          snapshot_date?: string
          ticket?: number | null
        }
        Relationships: []
      }
      metric_values: {
        Row: {
          created_at: string
          id: string
          metric_id: string
          ref_date: string
          source: string | null
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metric_id: string
          ref_date: string
          source?: string | null
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          metric_id?: string
          ref_date?: string
          source?: string | null
          value?: number
        }
        Relationships: []
      }
      metrics: {
        Row: {
          category: string | null
          created_at: string
          format: string
          id: string
          is_primary: boolean
          key: string
          label: string
          project_id: string
          sort_order: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          format?: string
          id?: string
          is_primary?: boolean
          key: string
          label: string
          project_id: string
          sort_order?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          format?: string
          id?: string
          is_primary?: boolean
          key?: string
          label?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: []
      }
      project_notes: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          id: string
          is_resolved: boolean
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_records: {
        Row: {
          created_at: string
          id: string
          payload: Json
          project_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload: Json
          project_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          project_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          end_date: string | null
          goals: Json
          id: string
          is_active: boolean
          name: string
          public_slug: string | null
          start_date: string | null
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          goals?: Json
          id?: string
          is_active?: boolean
          name: string
          public_slug?: string | null
          start_date?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          goals?: Json
          id?: string
          is_active?: boolean
          name?: string
          public_slug?: string | null
          start_date?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      visual_snapshots: {
        Row: {
          created_at: string
          id: string
          image_url: string
          project_id: string
          snapshot_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          project_id: string
          snapshot_date: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          project_id?: string
          snapshot_date?: string
        }
        Relationships: []
      }
      users_settings: {
        Row: {
          created_at: string
          preferences: Json
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          preferences?: Json
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          preferences?: Json
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
