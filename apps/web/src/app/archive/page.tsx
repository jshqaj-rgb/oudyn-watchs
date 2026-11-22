import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { getArchive } from "@/lib/api";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Archive",
  description: "Sold or unavailable references, kept as a record.",
};

export default async function ArchivePage() {
  const items = await getArchive();
  const years = items.map((item) => item.archiveYear).filter(Boolean).sort();

  return (
    <main id="main" className="pageMain">
      <div className="container">
        <PageHeader
          title="Archive"
          intro="References that are no longer available through OUDYN. They stay listed as a record of what was offered, not as items for sale."
          meta={
            <>
              <span>{items.length} archived references</span>
              {years.length > 0 ? (
                <span>
                  {years[0]} — {years[years.length - 1]}
                </span>
              ) : null}
              <span>Not for sale</span>
            </>
          }
        />
        {items.length > 0 ? (
          <div className={styles.grid}>
            {items.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>There are no archived references at the moment.</p>
        )}
        <div className={styles.note}>
          <p className={styles.noteTitle}>About the archive</p>
          <p>
            These watches are not available to buy. If you are looking for something similar, write
            to <a href="mailto:studio@oudyn.com">studio@oudyn.com</a> with the reference you have in
            mind. We do not promise to find an identical piece.
          </p>
        </div>
      </div>
    </main>
  );
}
