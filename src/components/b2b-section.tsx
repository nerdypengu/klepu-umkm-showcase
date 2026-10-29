import { ClipboardList, Store, Truck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { WholesaleRequestDialog } from "@/components/wholesale-request-dialog";
import type { Umkm } from "@/lib/umkm-data";

const channels = [
  {
    icon: ClipboardList,
    title: "Permintaan penawaran",
    detail: "Sebutkan produk, jumlah unit, tujuan pengiriman, dan tenggat kebutuhan untuk memperoleh penawaran.",
  },
  {
    icon: Store,
    title: "Distribusi & konsinyasi",
    detail: "Diskusikan harga distributor, skema pembayaran, retur, serta frekuensi pasokan.",
  },
  {
    icon: Truck,
    title: "Pasokan terencana",
    detail: "Konfirmasi MOQ, kapasitas bulanan, masa simpan, standar kemasan, dan lead time sebelum kesepakatan.",
  },
];

export function B2bSection({ umkmList }: { umkmList: Umkm[] }) {
  return (
    <section id="grosir" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:px-6">
      <Reveal className="max-w-2xl">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Grosir, reseller & pusat oleh-oleh</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Kami membuka ruang penjajakan untuk toko oleh-oleh, distributor, reseller, penyelenggara acara, dan pembelian
          korporat. Detail komersial ditetapkan langsung oleh produsen atau pengelola resmi.
        </p>
      </Reveal>

      <div className="mt-9 overflow-hidden rounded-3xl border border-border bg-card shadow-clay">
        <ul className="divide-y divide-border md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
          {channels.map(({ icon: Icon, title, detail }, index) => (
            <li key={title}>
              <Reveal delay={index * 110} className="p-6 sm:p-7">
                <Icon className="size-5 text-primary" strokeWidth={1.75} aria-hidden />
                <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{detail}</p>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-5 border-t border-border bg-secondary/50 p-6 sm:p-7 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h3 className="font-display text-xl font-bold">Butuh pasokan untuk toko atau acara?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Kirim daftar produk yang Anda butuhkan, pengelola akan menghubungi Anda untuk penawaran. Kontak resmi pusat
              oleh-oleh Desa Klepu masih menunggu konfirmasi.
            </p>
          </div>
          <div className="shrink-0">
            <WholesaleRequestDialog umkmList={umkmList} />
          </div>
        </div>
      </div>
    </section>
  );
}
