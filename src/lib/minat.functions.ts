import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export interface MinatSubmissionInput {
  userId: string;
  umkmId: string;
  investmentType: "modal_kerja" | "pengadaan_alat" | "bagi_hasil" | "kemitraan_distribusi" | "lainnya";
  targetItem?: string | null;
  nominalInvestment?: number | null;
  notes: string;
  contactPhone: string;
  proposalUrl?: string | null;
  proposalFilename?: string | null;
}

export const submitMinatServerFn = createServerFn({ method: "POST" })
  .validator((data: MinatSubmissionInput) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data?: unknown; error?: string }> => {
    try {
      const { data: result, error } = await supabase.rpc("submit_minat", {
        p_user_id: data.userId,
        p_umkm_id: data.umkmId,
        p_investment_type: data.investmentType,
        p_target_item: data.targetItem ?? null,
        p_nominal: data.nominalInvestment ?? null,
        p_notes: data.notes,
        p_phone: data.contactPhone,
        p_proposal_url: data.proposalUrl ?? null,
        p_proposal_filename: data.proposalFilename ?? null,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: result };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengajukan minat investasi";
      return { success: false, error: message };
    }
  });

export interface MyMinatItem {
  id: string;
  userId: string;
  umkmId: string;
  umkmName: string;
  umkmCategory: string;
  umkmSlug: string;
  umkmImage: string | null;
  investmentType: "modal_kerja" | "pengadaan_alat" | "bagi_hasil" | "kemitraan_distribusi" | "lainnya";
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

export const getMyMinatListServerFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: MyMinatItem[]; error?: string }> => {
    try {
      const { data: result, error } = await supabase.rpc("get_my_minat", {
        p_token: data.token,
      });

      if (error) {
        return { success: false, error: error.message, data: [] };
      }

      return { success: true, data: (result || []) as unknown as MyMinatItem[] };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memuat riwayat minat";
      return { success: false, error: message, data: [] };
    }
  });

export const getUserMinatListServerFn = getMyMinatListServerFn;
