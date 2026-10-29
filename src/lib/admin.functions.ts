import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { Umkm } from "@/lib/umkm-data";

export interface AdminDashboardStats {
  totalUmkm: number;
  totalMitra: number;
  mitraPersonal: number;
  mitraOrganisasi: number;
  mitraPersero: number;
  totalMinat: number;
  minatMenunggu: number;
  minatDiskusi: number;
  minatDisetujui: number;
  totalNominalInvestasi: number;
}

export interface AdminMitraItem {
  id: string;
  username: string;
  fullName: string;
  role: "admin" | "mitra";
  mitraType: "personal" | "organisasi" | "persero";
  organizationName: string | null;
  organizationPosition: string | null;
  phone: string;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  totalMinat: number;
}

export interface AdminMinatItem {
  id: string;
  userId: string;
  umkmId: string;
  umkmName: string;
  umkmCategory: string;
  mitraUsername: string;
  mitraFullName: string;
  mitraType: "personal" | "organisasi" | "persero";
  organizationName: string | null;
  investmentType: string;
  targetItem: string | null;
  nominalInvestment: number | null;
  notes: string;
  contactPhone: string;
  proposalUrl: string | null;
  proposalFilename: string | null;
  status: "menunggu_konfirmasi" | "dalam_diskusi" | "disetujui" | "ditolak" | "selesai";
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminWholesaleItem {
  id: string;
  requesterType: "personal" | "organisasi";
  fullName: string;
  organizationName: string | null;
  phone: string;
  email: string | null;
  notes: string | null;
  status: "baru" | "dihubungi" | "selesai" | "dibatalkan";
  createdAt: string;
  updatedAt: string;
  items: { id: string; umkmId: string | null; productName: string; quantity: number; unit: string }[];
}

export const getAdminDashboardStatsServerFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string }) => data)
  .handler(
    async ({ data }): Promise<{ success: boolean; stats?: AdminDashboardStats; error?: string }> => {
      try {
        const { data: result, error } = await supabase.rpc("get_admin_dashboard_stats", {
          p_admin_token: data.adminToken,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, stats: result as unknown as AdminDashboardStats };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal memuat statistik admin";
        return { success: false, error: message };
      }
    },
  );

export const getAdminMitraListServerFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string }) => data)
  .handler(
    async ({ data }): Promise<{ success: boolean; mitras: AdminMitraItem[]; error?: string }> => {
      try {
        const { data: result, error } = await supabase.rpc("get_all_mitra", {
          p_admin_token: data.adminToken,
        });

        if (error) {
          return { success: false, mitras: [], error: error.message };
        }

        return { success: true, mitras: (result || []) as unknown as AdminMitraItem[] };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal memuat daftar mitra";
        return { success: false, mitras: [], error: message };
      }
    },
  );

export const getAdminMinatListServerFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string }) => data)
  .handler(
    async ({ data }): Promise<{ success: boolean; minats: AdminMinatItem[]; error?: string }> => {
      try {
        const { data: result, error } = await supabase.rpc("get_all_minat", {
          p_admin_token: data.adminToken,
        });

        if (error) {
          return { success: false, minats: [], error: error.message };
        }

        return { success: true, minats: (result || []) as unknown as AdminMinatItem[] };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal memuat daftar minat";
        return { success: false, minats: [], error: message };
      }
    },
  );

export const getAdminWholesaleListServerFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string }) => data)
  .handler(
    async ({ data }): Promise<{ success: boolean; requests: AdminWholesaleItem[]; error?: string }> => {
      try {
        const { data: result, error } = await supabase.rpc("get_all_wholesale_requests", {
          p_admin_token: data.adminToken,
        });

        if (error) {
          return { success: false, requests: [], error: error.message };
        }

        return { success: true, requests: (result || []) as unknown as AdminWholesaleItem[] };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal memuat permintaan grosir";
        return { success: false, requests: [], error: message };
      }
    },
  );

export const updateWholesaleStatusServerFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; requestId: string; status: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.rpc("update_wholesale_request_status", {
        p_admin_token: data.adminToken,
        p_request_id: data.requestId,
        p_status: data.status,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memperbarui status permintaan grosir";
      return { success: false, error: message };
    }
  });

export const updateMinatStatusServerFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; minatId: string; status: string; adminNotes?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.rpc("update_minat_status", {
        p_admin_token: data.adminToken,
        p_minat_id: data.minatId,
        p_status: data.status,
        p_admin_notes: data.adminNotes ?? null,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memperbarui status minat";
      return { success: false, error: message };
    }
  });

export const saveUmkmServerFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; umkm: Partial<Umkm> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; id?: string; error?: string }> => {
    try {
      const u = data.umkm;
      const id = u.id || `UMKM-${Date.now().toString().slice(-6)}`;
      const slug =
        u.slug?.trim() ||
        (u.name || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const fullData = {
        ...u,
        id,
        slug,
        activeStatus: u.activeStatus || "Aktif",
      };

      const { error } = await supabase.rpc("admin_save_umkm", {
        p_admin_token: data.adminToken,
        p_id: id,
        p_slug: slug,
        p_data: fullData as unknown as Json,
        p_sort_order: 0,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, id };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan data UMKM";
      return { success: false, error: message };
    }
  });

export const deleteUmkmServerFn = createServerFn({ method: "POST" })
  .validator((data: { adminToken: string; id: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.rpc("admin_remove_umkm_record", {
        p_admin_token: data.adminToken,
        p_id: data.id,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menghapus UMKM";
      return { success: false, error: message };
    }
  });
