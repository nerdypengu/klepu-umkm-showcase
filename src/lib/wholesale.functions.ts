import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface WholesaleItemInput {
  umkmId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface WholesaleRequestInput {
  requesterType: "personal" | "organisasi";
  fullName: string;
  organizationName?: string | null;
  phone: string;
  email?: string | null;
  notes?: string | null;
  items: WholesaleItemInput[];
}

export const submitWholesaleRequestServerFn = createServerFn({ method: "POST" })
  .validator((data: WholesaleRequestInput) => data)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.rpc("submit_wholesale_request", {
        p_requester_type: data.requesterType,
        p_full_name: data.fullName,
        p_phone: data.phone,
        p_items: data.items as unknown as Json,
        p_organization_name: data.organizationName ?? null,
        p_email: data.email ?? null,
        p_notes: data.notes ?? null,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengirim permintaan grosir";
      return { success: false, error: message };
    }
  });
