import { createServerFn } from "@tanstack/react-start";

type UploadKind = "umkm-media" | "proposal";

const MEDIA_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

const PROPOSAL_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

const LIMITS = { "umkm-media": 50 * 1024 * 1024, proposal: 20 * 1024 * 1024 } as const;

export interface UploadTarget {
  bucket: string;
  path: string;
  uploadToken: string;
  publicUrl: string;
}

// Issues a one-time signed upload URL. The browser key can no longer write to storage,
// so the server checks who is asking (admin for media, any signed-in mitra for proposals) first.
export const createUploadTargetServerFn = createServerFn({ method: "POST" })
  .validator((data: { kind: UploadKind; token: string; contentType: string; size: number; prefix?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; target?: UploadTarget; error?: string }> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      // The generated Database type does not describe these server-only helpers.
      const rpc = supabaseAdmin.rpc as unknown as (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{ data: unknown; error: { message: string } | null }>;
      const callRpc = rpc.bind(supabaseAdmin);

      const types = data.kind === "umkm-media" ? MEDIA_TYPES : PROPOSAL_TYPES;
      const ext = types[data.contentType];
      if (!ext) return { success: false, error: "Format berkas tidak diizinkan." };
      if (!(data.size > 0) || data.size > LIMITS[data.kind]) {
        return { success: false, error: `Ukuran berkas maksimal ${LIMITS[data.kind] / (1024 * 1024)} MB.` };
      }

      const random = Math.random().toString(36).slice(2, 10);
      let bucket: string;
      let path: string;

      if (data.kind === "umkm-media") {
        const { error } = await callRpc("verify_admin_session", { p_token: data.token });
        if (error) return { success: false, error: "Akses ditolak." };
        bucket = "umkm-media";
        const prefix = (data.prefix ?? "media").toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 40) || "media";
        path = `${prefix}-${Date.now()}-${random}.${ext}`;
      } else {
        const { data: userId, error } = await callRpc("verify_user_session", { p_token: data.token });
        if (error || typeof userId !== "string") return { success: false, error: "Sesi tidak valid. Silakan masuk kembali." };
        bucket = "investment-proposals";
        path = `${userId}/${Date.now()}-${random}.${ext}`;
      }

      const { data: signed, error: signError } = await supabaseAdmin.storage.from(bucket).createSignedUploadUrl(path);
      if (signError || !signed) return { success: false, error: "Gagal menyiapkan unggahan." };

      const { data: pub } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
      return { success: true, target: { bucket, path, uploadToken: signed.token, publicUrl: pub.publicUrl } };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyiapkan unggahan.";
      return { success: false, error: message };
    }
  });
