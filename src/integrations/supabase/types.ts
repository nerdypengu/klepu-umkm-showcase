export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          full_name: string;
          role: "admin" | "mitra";
          mitra_type: "personal" | "organisasi" | "persero";
          organization_name: string | null;
          organization_position: string | null;
          phone: string;
          address: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          full_name: string;
          role?: "admin" | "mitra";
          mitra_type?: "personal" | "organisasi" | "persero";
          organization_name?: string | null;
          organization_position?: string | null;
          phone: string;
          address?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          full_name?: string;
          role?: "admin" | "mitra";
          mitra_type?: "personal" | "organisasi" | "persero";
          organization_name?: string | null;
          organization_position?: string | null;
          phone?: string;
          address?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      minat: {
        Row: {
          id: string;
          user_id: string;
          umkm_id: string;
          investment_type: "modal_kerja" | "pengadaan_alat" | "bagi_hasil" | "kemitraan_distribusi" | "lainnya";
          target_item: string | null;
          nominal_investment: number | null;
          notes: string;
          contact_phone: string;
          proposal_url: string | null;
          proposal_filename: string | null;
          status: "menunggu_konfirmasi" | "dalam_diskusi" | "disetujui" | "ditolak" | "selesai";
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          umkm_id: string;
          investment_type: "modal_kerja" | "pengadaan_alat" | "bagi_hasil" | "kemitraan_distribusi" | "lainnya";
          target_item?: string | null;
          nominal_investment?: number | null;
          notes: string;
          contact_phone: string;
          proposal_url?: string | null;
          proposal_filename?: string | null;
          status?: "menunggu_konfirmasi" | "dalam_diskusi" | "disetujui" | "ditolak" | "selesai";
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          umkm_id?: string;
          investment_type?: "modal_kerja" | "pengadaan_alat" | "bagi_hasil" | "kemitraan_distribusi" | "lainnya";
          target_item?: string | null;
          nominal_investment?: number | null;
          notes?: string;
          contact_phone?: string;
          proposal_url?: string | null;
          proposal_filename?: string | null;
          status?: "menunggu_konfirmasi" | "dalam_diskusi" | "disetujui" | "ditolak" | "selesai";
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      wholesale_requests: {
        Row: {
          id: string;
          requester_type: "personal" | "organisasi";
          full_name: string;
          organization_name: string | null;
          phone: string;
          email: string | null;
          notes: string | null;
          status: "baru" | "dihubungi" | "selesai" | "dibatalkan";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_type: "personal" | "organisasi";
          full_name: string;
          organization_name?: string | null;
          phone: string;
          email?: string | null;
          notes?: string | null;
          status?: "baru" | "dihubungi" | "selesai" | "dibatalkan";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          requester_type?: "personal" | "organisasi";
          full_name?: string;
          organization_name?: string | null;
          phone?: string;
          email?: string | null;
          notes?: string | null;
          status?: "baru" | "dihubungi" | "selesai" | "dibatalkan";
          created_at?: string;
          updated_at?: string;
        };
      };
      wholesale_request_items: {
        Row: {
          id: string;
          request_id: string;
          umkm_id: string | null;
          product_name: string;
          quantity: number;
          unit: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          umkm_id?: string | null;
          product_name: string;
          quantity: number;
          unit: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          umkm_id?: string | null;
          product_name?: string;
          quantity?: number;
          unit?: string;
          created_at?: string;
        };
      };
      umkm_potentials: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          image_url: string | null;
          ideas: string[];
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          image_url?: string | null;
          ideas?: string[];
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<{
          id: string;
          slug: string;
          title: string;
          description: string;
          image_url: string | null;
          ideas: string[];
          sort_order: number;
          is_active: boolean;
          created_at: string;
        }>;
      };
      potential_interests: {
        Row: {
          id: string;
          potential_id: string | null;
          potential_title: string;
          full_name: string;
          phone: string;
          email: string | null;
          notes: string | null;
          status: "baru" | "dihubungi" | "selesai" | "dibatalkan";
          created_at: string;
        };
        Insert: {
          id?: string;
          potential_id?: string | null;
          potential_title: string;
          full_name: string;
          phone: string;
          email?: string | null;
          notes?: string | null;
          status?: "baru" | "dihubungi" | "selesai" | "dibatalkan";
          created_at?: string;
        };
        Update: Partial<{
          potential_id: string | null;
          potential_title: string;
          full_name: string;
          phone: string;
          email: string | null;
          notes: string | null;
          status: "baru" | "dihubungi" | "selesai" | "dibatalkan";
        }>;
      };
      umkm: {
        Row: {
          id: string;
          slug: string;
          sort_order: number;
          data: Json;
          created_at: string;
          updated_at: string;
          name?: string;
          owner?: string;
          category?: string;
          product?: string;
          summary?: string;
          description?: string | null;
          is_active?: boolean;
          whatsapp?: string | null;
          maps_url?: string | null;
        };
        Insert: {
          id: string;
          slug: string;
          sort_order?: number;
          data: Json;
          created_at?: string;
          updated_at?: string;
          name?: string;
          owner?: string;
          category?: string;
          product?: string;
          summary?: string;
          description?: string | null;
          is_active?: boolean;
          whatsapp?: string | null;
          maps_url?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          sort_order?: number;
          data?: Json;
          created_at?: string;
          updated_at?: string;
          name?: string;
          owner?: string;
          category?: string;
          product?: string;
          summary?: string;
          description?: string | null;
          is_active?: boolean;
          whatsapp?: string | null;
          maps_url?: string | null;
        };
      };
      umkm_products: {
        Row: {
          id: string;
          umkm_id: string;
          name: string;
          description: string | null;
          price: number;
          quantity: number;
          unit: string;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          name: string;
          description?: string | null;
          price: number;
          quantity?: number;
          unit: string;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          quantity?: number;
          unit?: string;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      umkm_investments: {
        Row: {
          id: string;
          umkm_id: string;
          readiness: "siap" | "dipertimbangkan" | "belum_siap";
          readiness_reason: string | null;
          investment_min: number | null;
          investment_max: number | null;
          investment_display: string | null;
          market: string | null;
          market_note: string | null;
          opportunity_context: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          readiness: "siap" | "dipertimbangkan" | "belum_siap";
          readiness_reason?: string | null;
          investment_min?: number | null;
          investment_max?: number | null;
          investment_display?: string | null;
          market?: string | null;
          market_note?: string | null;
          opportunity_context?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          readiness?: "siap" | "dipertimbangkan" | "belum_siap";
          readiness_reason?: string | null;
          investment_min?: number | null;
          investment_max?: number | null;
          investment_display?: string | null;
          market?: string | null;
          market_note?: string | null;
          opportunity_context?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      umkm_scores: {
        Row: {
          id: string;
          umkm_id: string;
          score_market: number;
          score_finance: number;
          score_materials: number;
          score_technology: number;
          score_distribution: number;
          priority_rank: number | null;
          priority_total: number | null;
          priority_summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          score_market?: number;
          score_finance?: number;
          score_materials?: number;
          score_technology?: number;
          score_distribution?: number;
          priority_rank?: number | null;
          priority_total?: number | null;
          priority_summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          score_market?: number;
          score_finance?: number;
          score_materials?: number;
          score_technology?: number;
          score_distribution?: number;
          priority_rank?: number | null;
          priority_total?: number | null;
          priority_summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      umkm_roi: {
        Row: {
          id: string;
          umkm_id: string;
          roi_percentage_min: number | null;
          roi_percentage_max: number | null;
          payback_years_min: number | null;
          payback_years_max: number | null;
          roi_basis: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          roi_percentage_min?: number | null;
          roi_percentage_max?: number | null;
          payback_years_min?: number | null;
          payback_years_max?: number | null;
          roi_basis?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          roi_percentage_min?: number | null;
          roi_percentage_max?: number | null;
          payback_years_min?: number | null;
          payback_years_max?: number | null;
          roi_basis?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      umkm_slugs: {
        Row: {
          id: string;
          umkm_id: string;
          slug: string;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          slug: string;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          slug?: string;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      umkm_media: {
        Row: {
          id: string;
          umkm_id: string;
          product_id: string | null;
          media_type: "image" | "video";
          url: string;
          poster_url: string | null;
          alt_text: string | null;
          is_cover: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          product_id?: string | null;
          media_type: "image" | "video";
          url: string;
          poster_url?: string | null;
          alt_text?: string | null;
          is_cover?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          product_id?: string | null;
          media_type?: "image" | "video";
          url?: string;
          poster_url?: string | null;
          alt_text?: string | null;
          is_cover?: boolean;
          created_at?: string;
        };
      };
      umkm_opportunities: {
        Row: {
          id: string;
          umkm_id: string;
          name: string;
          investment_amount: number | null;
          investment_display: string | null;
          detail: string;
          recommended: boolean;
          recommended_reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          name: string;
          investment_amount?: number | null;
          investment_display?: string | null;
          detail: string;
          recommended?: boolean;
          recommended_reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          name?: string;
          investment_amount?: number | null;
          investment_display?: string | null;
          detail?: string;
          recommended?: boolean;
          recommended_reason?: string | null;
          created_at?: string;
        };
      };
      umkm_facts: {
        Row: {
          id: string;
          umkm_id: string;
          label: string;
          value: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          label: string;
          value: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          label?: string;
          value?: string;
          created_at?: string;
        };
      };
      umkm_operations: {
        Row: {
          id: string;
          umkm_id: string;
          label: string;
          value: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          label: string;
          value: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          label?: string;
          value?: string;
          created_at?: string;
        };
      };
      umkm_roles: {
        Row: {
          id: string;
          umkm_id: string;
          label: string;
          value: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          label: string;
          value: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          label?: string;
          value?: string;
          created_at?: string;
        };
      };
      umkm_list_items: {
        Row: {
          id: string;
          umkm_id: string;
          category: "risk" | "mitigation" | "prerequisite" | "investment_use" | "market_target" | "gap" | "potential";
          value: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          category: "risk" | "mitigation" | "prerequisite" | "investment_use" | "market_target" | "gap" | "potential";
          value: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          category?: "risk" | "mitigation" | "prerequisite" | "investment_use" | "market_target" | "gap" | "potential";
          value?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      register_mitra: {
        Args: {
          p_username: string;
          p_password: string;
          p_full_name: string;
          p_phone: string;
          p_mitra_type?: string;
          p_organization_name?: string | null;
          p_organization_position?: string | null;
          p_address?: string | null;
        };
        Returns: Json;
      };
      login_user: {
        Args: {
          p_username: string;
          p_password: string;
        };
        Returns: Json;
      };
      submit_minat: {
        Args: {
          p_user_id: string;
          p_umkm_id: string;
          p_investment_type: string;
          p_target_item?: string | null;
          p_nominal?: number | null;
          p_notes?: string | null;
          p_phone?: string | null;
          p_proposal_url?: string | null;
          p_proposal_filename?: string | null;
        };
        Returns: Json;
      };
      submit_wholesale_request: {
        Args: {
          p_requester_type: string;
          p_full_name: string;
          p_phone: string;
          p_items: Json;
          p_organization_name?: string | null;
          p_email?: string | null;
          p_notes?: string | null;
        };
        Returns: Json;
      };
      get_all_wholesale_requests: {
        Args: {
          p_admin_token: string;
        };
        Returns: Json;
      };
      update_wholesale_request_status: {
        Args: {
          p_admin_token: string;
          p_request_id: string;
          p_status: string;
        };
        Returns: Json;
      };
      submit_potential_interest: {
        Args: {
          p_potential_id: string;
          p_full_name: string;
          p_phone: string;
          p_email?: string | null;
          p_notes?: string | null;
        };
        Returns: Json;
      };
      get_admin_dashboard_stats: {
        Args: {
          p_admin_token: string;
        };
        Returns: Json;
      };
      get_all_mitra: {
        Args: {
          p_admin_token: string;
        };
        Returns: Json;
      };
      get_all_minat: {
        Args: {
          p_admin_token: string;
        };
        Returns: Json;
      };
      update_minat_status: {
        Args: {
          p_admin_token: string;
          p_minat_id: string;
          p_status: string;
          p_admin_notes?: string | null;
        };
        Returns: Json;
      };
      logout_user: {
        Args: {
          p_token: string;
        };
        Returns: Json;
      };
      admin_save_umkm: {
        Args: {
          p_admin_token: string;
          p_id: string;
          p_slug: string;
          p_data: Json;
          p_sort_order?: number;
        };
        Returns: Json;
      };
      admin_remove_umkm_record: {
        Args: {
          p_admin_token: string;
          p_id: string;
        };
        Returns: Json;
      };
      admin_set_umkm_status: {
        Args: {
          p_admin_token: string;
          p_id: string;
          p_is_active: boolean;
        };
        Returns: Json;
      };
      get_my_minat: {
        Args: {
          p_token: string;
        };
        Returns: Json;
      };
      provision_admin_user: {
        Args: {
          p_username: string;
          p_password: string;
          p_full_name?: string;
          p_phone?: string;
          p_address?: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;
