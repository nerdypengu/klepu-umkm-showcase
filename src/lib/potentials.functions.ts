import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export interface UmkmPotential {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  ideas: string[];
}

// Never throws: the home page must still render if the table is missing or empty.
export const fetchPotentials = createServerFn({ method: "GET" }).handler(async (): Promise<UmkmPotential[]> => {
  try {
    const { data, error } = await supabase
      .from("umkm_potentials")
      .select("id, slug, title, description, image_url, ideas")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];

    // The hand-written Database type does not resolve table rows; cast explicitly.
    const rows = data as unknown as {
      id: string;
      slug: string;
      title: string;
      description: string;
      image_url: string | null;
      ideas: string[] | null;
    }[];

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      ideas: row.ideas ?? [],
    }));
  } catch {
    return [];
  }
});

export interface PotentialInterestInput {
  potentialId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
}

export const submitPotentialInterestServerFn = createServerFn({ method: "POST" })
  .validator((data: PotentialInterestInput) => data)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.rpc("submit_potential_interest", {
        p_potential_id: data.potentialId,
        p_full_name: data.fullName,
        p_phone: data.phone,
        p_email: data.email ?? null,
        p_notes: data.notes ?? null,
      });

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengirim minat";
      return { success: false, error: message };
    }
  });
