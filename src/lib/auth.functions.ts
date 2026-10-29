import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  role: "admin" | "mitra";
  mitraType: "personal" | "organisasi" | "persero";
  organizationName: string | null;
  organizationPosition: string | null;
  phone: string;
  address: string | null;
  createdAt: string;
}

export const loginUserServerFn = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> => {
    try {
      const { data: result, error } = await supabase.rpc("login_user", {
        p_username: data.username,
        p_password: data.password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const res = result as unknown as { user: UserProfile; token?: string } | UserProfile;
      if ("user" in res && "token" in res) {
        return { success: true, user: res.user, token: res.token };
      }

      return { success: true, user: res as UserProfile };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat login";
      return { success: false, error: message };
    }
  });

export const logoutUserServerFn = createServerFn({ method: "POST" })
  .validator((data: { token?: string | null }) => data)
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    try {
      if (data.token) {
        await supabase.rpc("logout_user", { p_token: data.token });
      }
      return { success: true };
    } catch {
      return { success: true };
    }
  });

export const registerMitraServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      username: string;
      password: string;
      fullName: string;
      phone: string;
      mitraType?: "personal" | "organisasi" | "persero";
      organizationName?: string | null;
      organizationPosition?: string | null;
      address?: string | null;
    }) => data,
  )
  .handler(async ({ data }): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    try {
      const { data: result, error } = await supabase.rpc("register_mitra", {
        p_username: data.username,
        p_password: data.password,
        p_full_name: data.fullName,
        p_phone: data.phone,
        p_mitra_type: data.mitraType || "personal",
        p_organization_name: data.organizationName || null,
        p_organization_position: data.organizationPosition || null,
        p_address: data.address || null,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const raw = result as Record<string, unknown>;
      const userProfile: UserProfile = {
        id: raw["id"] as string,
        username: raw["username"] as string,
        fullName: (raw["full_name"] || raw["fullName"]) as string,
        role: raw["role"] as "admin" | "mitra",
        mitraType: (raw["mitra_type"] || raw["mitraType"]) as "personal" | "organisasi" | "persero",
        organizationName: (raw["organization_name"] || raw["organizationName"] || null) as string | null,
        organizationPosition: (raw["organization_position"] || raw["organizationPosition"] || null) as string | null,
        phone: raw["phone"] as string,
        address: (raw["address"] || null) as string | null,
        createdAt: (raw["created_at"] || raw["createdAt"]) as string,
      };

      return { success: true, user: userProfile };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat pendaftaran";
      return { success: false, error: message };
    }
  });
