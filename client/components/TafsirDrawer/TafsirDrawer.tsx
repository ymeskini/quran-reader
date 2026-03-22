import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Drawer } from "vaul";
import styles from "./TafsirDrawer.module.css";

interface TafsirData {
  ayah_key: string;
  text: string;
}

const isDev = location.port === "3000";

async function fetchTafsir(surah: number, ayah: number): Promise<TafsirData> {
  if (isDev) {
    const res = await fetch(`/api/tafsir/${surah}/${ayah}`);
    return res.json();
  }
  const res = await fetch(`/api/tafsir/${surah}.json`);
  const map: Record<string, string> = await res.json();
  const ayahKey = `${surah}:${ayah}`;
  return { ayah_key: ayahKey, text: map[ayahKey] || "" };
}

export function TafsirDrawer({
  ayahKey,
  onClose,
}: {
  ayahKey: string | null;
  onClose: () => void;
}) {
  const parts = ayahKey ? ayahKey.split(":") : [];
  const surah = Number(parts[0]) || 0;
  const ayah = Number(parts[1]) || 0;

  const { data, isLoading } = useQuery({
    queryKey: ["tafsir", surah, ayah] as const,
    queryFn: () => fetchTafsir(surah, ayah),
    enabled: !!ayahKey,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return (
    <Drawer.Root
      direction="right"
      open={!!ayahKey}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className={styles.overlay} />
        <Drawer.Content className={styles.drawer} aria-describedby={undefined}>
          <div className={styles.header}>
            <Drawer.Title className={styles.title}>
              تفسير السعدي — {ayahKey}
            </Drawer.Title>
            <button className={styles.close} onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>
          {isLoading ? (
            <div className={styles.loading}>جاري التحميل...</div>
          ) : data ? (
            <div
              className={`${styles.text} tafsir-text`}
              dangerouslySetInnerHTML={{ __html: data.text }}
            />
          ) : null}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
