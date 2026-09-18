import { createServerFn } from "@tanstack/react-start";
import type { Umkm } from "@/lib/umkm-data";

function restBase() {
  const raw = process.env["EXT_SUPABASE_URL"];
  if (!raw) throw new Error("EXT_SUPABASE_URL is not configured");
  return raw.replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
}

export const fetchUmkmList = createServerFn({ method: "GET" }).handler(async (): Promise<Umkm[]> => {
  const key = process.env["EXT_SUPABASE_ANON_KEY"];
  if (!key) throw new Error("EXT_SUPABASE_ANON_KEY is not configured");

  const headers: Record<string, string> = { apikey: key };
  if (!key.startsWith("sb_")) headers["Authorization"] = `Bearer ${key}`;

  const response = await fetch(
    `${restBase()}/rest/v1/umkm?select=data,sort_order&order=sort_order.asc`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(`Gagal memuat data UMKM (${response.status})`);
  }

  const rows = (await response.json()) as { data: Umkm }[];
  return rows.map((row) => row.data);
});
