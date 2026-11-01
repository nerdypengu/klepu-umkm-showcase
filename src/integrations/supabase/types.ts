// Generated from the umkm-klepu Supabase project (generate_typescript_types), helper types trimmed.
// Regenerate after every schema change. One manual edit: optional function arguments also accept null
// (the database treats null as the default), which the generator leaves out.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.17";
  };
  public: {
    Tables: {
      login_failures: {
        Row: { created_at: string; id: number; username: string };
        Insert: { created_at?: string; id?: number; username: string };
        Update: { created_at?: string; id?: number; username?: string };
        Relationships: [];
      };
      minat: {
        Row: {
          admin_notes: string | null;
          contact_phone: string;
          created_at: string;
          id: string;
          investment_type: string;
          nominal_investment: number | null;
          notes: string;
          proposal_filename: string | null;
          proposal_url: string | null;
          status: string;
          target_item: string | null;
          umkm_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          admin_notes?: string | null;
          contact_phone: string;
          created_at?: string;
          id?: string;
          investment_type: string;
          nominal_investment?: number | null;
          notes: string;
          proposal_filename?: string | null;
          proposal_url?: string | null;
          status?: string;
          target_item?: string | null;
          umkm_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          admin_notes?: string | null;
          contact_phone?: string;
          created_at?: string;
          id?: string;
          investment_type?: string;
          nominal_investment?: number | null;
          notes?: string;
          proposal_filename?: string | null;
          proposal_url?: string | null;
          status?: string;
          target_item?: string | null;
          umkm_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "minat_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: false;
            referencedRelation: "umkm";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "minat_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      potential_interests: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          notes: string | null;
          phone: string;
          potential_id: string | null;
          potential_title: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          notes?: string | null;
          phone: string;
          potential_id?: string | null;
          potential_title: string;
          status?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          notes?: string | null;
          phone?: string;
          potential_id?: string | null;
          potential_title?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "potential_interests_potential_id_fkey";
            columns: ["potential_id"];
            isOneToOne: false;
            referencedRelation: "umkm_potentials";
            referencedColumns: ["id"];
          },
        ];
      };
      umkm: {
        Row: { created_at: string; data: Json; id: string; slug: string; sort_order: number; updated_at: string };
        Insert: { created_at?: string; data: Json; id: string; slug: string; sort_order?: number; updated_at?: string };
        Update: { created_at?: string; data?: Json; id?: string; slug?: string; sort_order?: number; updated_at?: string };
        Relationships: [];
      };
      umkm_facts: {
        Row: { created_at: string; id: string; label: string; umkm_id: string; value: string };
        Insert: { created_at?: string; id?: string; label: string; umkm_id: string; value: string };
        Update: { created_at?: string; id?: string; label?: string; umkm_id?: string; value?: string };
        Relationships: [
          {
            foreignKeyName: "umkm_facts_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: false;
            referencedRelation: "umkm";
            referencedColumns: ["id"];
          },
        ];
      };
      umkm_investments: {
        Row: {
          created_at: string;
          id: string;
          investment_display: string | null;
          investment_max: number | null;
          investment_min: number | null;
          market: string | null;
          market_note: string | null;
          opportunity_context: string | null;
          readiness: string;
          readiness_reason: string | null;
          umkm_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          investment_display?: string | null;
          investment_max?: number | null;
          investment_min?: number | null;
          market?: string | null;
          market_note?: string | null;
          opportunity_context?: string | null;
          readiness: string;
          readiness_reason?: string | null;
          umkm_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          investment_display?: string | null;
          investment_max?: number | null;
          investment_min?: number | null;
          market?: string | null;
          market_note?: string | null;
          opportunity_context?: string | null;
          readiness?: string;
          readiness_reason?: string | null;
          umkm_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "umkm_investments_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: true;
            referencedRelation: "umkm";
            referencedColumns: ["id"];
          },
        ];
      };
      umkm_list_items: {
        Row: { category: string; created_at: string; id: string; umkm_id: string; value: string };
        Insert: { category: string; created_at?: string; id?: string; umkm_id: string; value: string };
        Update: { category?: string; created_at?: string; id?: string; umkm_id?: string; value?: string };
        Relationships: [
          {
            foreignKeyName: "umkm_list_items_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: false;
            referencedRelation: "umkm";
            referencedColumns: ["id"];
          },
        ];
      };
      umkm_media: {
        Row: {
          alt_text: string | null;
          created_at: string;
          id: string;
          is_cover: boolean;
          media_type: string;
          poster_url: string | null;
          product_id: string | null;
          umkm_id: string;
          url: string;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          id?: string;
          is_cover?: boolean;
          media_type: string;
          poster_url?: string | null;
          product_id?: string | null;
          umkm_id: string;
          url: string;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string;
          id?: string;
          is_cover?: boolean;
          media_type?: string;
          poster_url?: string | null;
          product_id?: string | null;
          umkm_id?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "umkm_media_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "umkm_products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "umkm_media_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: false;
            referencedRelation: "umkm";
            referencedColumns: ["id"];
          },
        ];
      };
      umkm_operations: {
        Row: { created_at: string; id: string; label: string; umkm_id: string; value: string };
        Insert: { created_at?: string; id?: string; label: string; umkm_id: string; value: string };
        Update: { created_at?: string; id?: string; label?: string; umkm_id?: string; value?: string };
        Relationships: [
          {
            foreignKeyName: "umkm_operations_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: false;
            referencedRelation: "umkm";
            referencedColumns: ["id"];
          },
        ];
      };
      umkm_opportunities: {
        Row: {
          created_at: string;
          detail: string;
          id: string;
          investment_amount: number | null;
          investment_display: string | null;
          name: string;
          recommended: boolean;
          recommended_reason: string | null;
          umkm_id: string;
        };
        Insert: {
          created_at?: string;
          detail: string;
          id?: string;
          investment_amount?: number | null;
          investment_display?: string | null;
          name: string;
          recommended?: boolean;
          recommended_reason?: string | null;
          umkm_id: string;
        };
        Update: {
          created_at?: string;
          detail?: string;
          id?: string;
          investment_amount?: number | null;
          investment_display?: string | null;
          name?: string;
          recommended?: boolean;
          recommended_reason?: string | null;
          umkm_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "umkm_opportunities_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: false;
            referencedRelation: "umkm";
            referencedColumns: ["id"];
          },
        ];
      };
      umkm_potentials: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          ideas: string[];
          image_url: string | null;
          is_active: boolean;
          slug: string;
          sort_order: number;
          title: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          ideas?: string[];
          image_url?: string | null;
          is_active?: boolean;
          slug: string;
          sort_order?: number;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          ideas?: string[];
          image_url?: string | null;
          is_active?: boolean;
          slug?: string;
          sort_order?: number;
          title?: string;
        };
        Relationships: [];
      };
      umkm_products: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_primary: boolean;
          name: string;
          price: number;
          quantity: number;
          umkm_id: string;
          unit: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_primary?: boolean;
          name: string;
          price: number;
          quantity?: number;
          umkm_id: string;
          unit: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_primary?: boolean;
          name?: string;
          price?: number;
          quantity?: number;
          umkm_id?: string;
          unit?: string;
        };
        Relationships: [
          {
            foreignKeyName: "umkm_products_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: false;
            referencedRelation: "umkm";
            referencedColumns: ["id"];
          },
        ];
      };
      umkm_roi: {
        Row: {
          created_at: string;
          id: string;
          notes: string | null;
          payback_years_max: number | null;
          payback_years_min: number | null;
          roi_basis: string | null;
          roi_percentage_max: number | null;
          roi_percentage_min: number | null;
          umkm_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          notes?: string | null;
          payback_years_max?: number | null;
          payback_years_min?: number | null;
          roi_basis?: string | null;
          roi_percentage_max?: number | null;
          roi_percentage_min?: number | null;
          umkm_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          notes?: string | null;
          payback_years_max?: number | null;
          payback_years_min?: number | null;
          roi_basis?: string | null;
          roi_percentage_max?: number | null;
          roi_percentage_min?: number | null;
          umkm_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "umkm_roi_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: true;
            referencedRelation: "umkm";
            referencedColumns: ["id"];
          },
        ];
      };
      umkm_roles: {
        Row: { created_at: string; id: string; label: string; umkm_id: string; value: string };
        Insert: { created_at?: string; id?: string; label: string; umkm_id: string; value: string };
        Update: { created_at?: string; id?: string; label?: string; umkm_id?: string; value?: string };
        Relationships: [
          {
            foreignKeyName: "umkm_roles_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: false;
            referencedRelation: "umkm";
            referencedColumns: ["id"];
          },
        ];
      };
      umkm_scores: {
        Row: {
          created_at: string;
          id: string;
          priority_rank: number | null;
          priority_summary: string | null;
          priority_total: number | null;
          score_distribution: number;
          score_finance: number;
          score_market: number;
          score_materials: number;
          score_technology: number;
          umkm_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          priority_rank?: number | null;
          priority_summary?: string | null;
          priority_total?: number | null;
          score_distribution?: number;
          score_finance?: number;
          score_market?: number;
          score_materials?: number;
          score_technology?: number;
          umkm_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          priority_rank?: number | null;
          priority_summary?: string | null;
          priority_total?: number | null;
          score_distribution?: number;
          score_finance?: number;
          score_market?: number;
          score_materials?: number;
          score_technology?: number;
          umkm_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "umkm_scores_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: true;
            referencedRelation: "umkm";
            referencedColumns: ["id"];
          },
        ];
      };
      umkm_slugs: {
        Row: { created_at: string; id: string; is_primary: boolean; slug: string; umkm_id: string };
        Insert: { created_at?: string; id?: string; is_primary?: boolean; slug: string; umkm_id: string };
        Update: { created_at?: string; id?: string; is_primary?: boolean; slug?: string; umkm_id?: string };
        Relationships: [
          {
            foreignKeyName: "umkm_slugs_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: false;
            referencedRelation: "umkm";
            referencedColumns: ["id"];
          },
        ];
      };
      user_sessions: {
        Row: { created_at: string; expires_at: string; id: string; role: string; token: string; user_id: string };
        Insert: { created_at?: string; expires_at: string; id?: string; role: string; token: string; user_id: string };
        Update: { created_at?: string; expires_at?: string; id?: string; role?: string; token?: string; user_id?: string };
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          address: string | null;
          created_at: string;
          full_name: string;
          id: string;
          is_active: boolean;
          mitra_type: string;
          organization_name: string | null;
          organization_position: string | null;
          password_hash: string;
          phone: string;
          role: string;
          updated_at: string;
          username: string;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          full_name: string;
          id?: string;
          is_active?: boolean;
          mitra_type?: string;
          organization_name?: string | null;
          organization_position?: string | null;
          password_hash: string;
          phone: string;
          role?: string;
          updated_at?: string;
          username: string;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          full_name?: string;
          id?: string;
          is_active?: boolean;
          mitra_type?: string;
          organization_name?: string | null;
          organization_position?: string | null;
          password_hash?: string;
          phone?: string;
          role?: string;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
      wholesale_request_items: {
        Row: {
          created_at: string;
          id: string;
          product_name: string;
          quantity: number;
          request_id: string;
          umkm_id: string | null;
          unit: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          product_name: string;
          quantity: number;
          request_id: string;
          umkm_id?: string | null;
          unit: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          product_name?: string;
          quantity?: number;
          request_id?: string;
          umkm_id?: string | null;
          unit?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wholesale_request_items_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "wholesale_requests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wholesale_request_items_umkm_id_fkey";
            columns: ["umkm_id"];
            isOneToOne: false;
            referencedRelation: "umkm";
            referencedColumns: ["id"];
          },
        ];
      };
      wholesale_requests: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          notes: string | null;
          organization_name: string | null;
          phone: string;
          requester_type: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          notes?: string | null;
          organization_name?: string | null;
          phone: string;
          requester_type: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          notes?: string | null;
          organization_name?: string | null;
          phone?: string;
          requester_type?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      admin_remove_umkm_record: {
        Args: { p_admin_token: string; p_id: string };
        Returns: Json;
      };
      admin_save_umkm: {
        Args: { p_admin_token: string; p_data: Json; p_id: string; p_slug: string; p_sort_order?: number | null };
        Returns: Json;
      };
      admin_set_umkm_status: {
        Args: { p_admin_token: string; p_id: string; p_is_active: boolean };
        Returns: Json;
      };
      get_admin_dashboard_stats: { Args: { p_admin_token: string }; Returns: Json };
      get_all_minat: { Args: { p_admin_token: string }; Returns: Json };
      get_all_mitra: { Args: { p_admin_token: string }; Returns: Json };
      get_all_wholesale_requests: { Args: { p_admin_token: string }; Returns: Json };
      get_my_minat: { Args: { p_token: string }; Returns: Json };
      login_user: { Args: { p_password: string; p_username: string }; Returns: Json };
      logout_user: { Args: { p_token: string }; Returns: Json };
      provision_admin_user: {
        Args: { p_address?: string | null; p_full_name?: string | null; p_password: string; p_phone?: string | null; p_username: string };
        Returns: Json;
      };
      register_mitra: {
        Args: {
          p_address?: string | null;
          p_full_name: string;
          p_mitra_type?: string | null;
          p_organization_name?: string | null;
          p_organization_position?: string | null;
          p_password: string;
          p_phone: string;
          p_username: string;
        };
        Returns: Json;
      };
      submit_minat: {
        Args: {
          p_investment_type: string;
          p_nominal?: number | null;
          p_notes?: string | null;
          p_phone?: string | null;
          p_proposal_filename?: string | null;
          p_proposal_url?: string | null;
          p_target_item?: string | null;
          p_token: string;
          p_umkm_id: string;
        };
        Returns: Json;
      };
      submit_potential_interest: {
        Args: { p_email?: string | null; p_full_name: string; p_notes?: string | null; p_phone: string; p_potential_id: string };
        Returns: Json;
      };
      submit_wholesale_request: {
        Args: {
          p_email?: string | null;
          p_full_name: string;
          p_items: Json;
          p_notes?: string | null;
          p_organization_name?: string | null;
          p_phone: string;
          p_requester_type: string;
        };
        Returns: Json;
      };
      update_minat_status: {
        Args: { p_admin_notes?: string | null; p_admin_token: string; p_minat_id: string; p_status: string };
        Returns: Json;
      };
      update_wholesale_request_status: {
        Args: { p_admin_token: string; p_request_id: string; p_status: string };
        Returns: Json;
      };
      verify_admin_session: { Args: { p_token: string }; Returns: string };
      verify_user_session: { Args: { p_token: string }; Returns: string };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
