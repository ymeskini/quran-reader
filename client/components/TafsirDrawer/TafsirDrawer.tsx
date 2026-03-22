import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Drawer } from "vaul";
import styles from "./TafsirDrawer.module.css";

const isDev = location.port === "3000";

async function fetchPageTafsir(page: number): Promise<Record<string, string>> {
  const url = isDev ? `/api/tafsir/page/${page}` : `/api/tafsir/page/${page}.json`;
  const res = await fetch(url);
  return res.json();
}

export function TafsirDrawer({
  ayahKey,
  page,
  onClose,
}: {
  ayahKey: string | null;
  page: number;
  onClose: () => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["tafsir", page] as const,
    queryFn: () => fetchPageTafsir(page),
    enabled: !!ayahKey,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const text = ayahKey && data ? data[ayahKey] : undefined;

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
          <div className={styles.scrollable} data-vaul-no-drag>
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
            ) : text ? (
              <div
                className={`${styles.text} tafsir-text`}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            ) : null}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
