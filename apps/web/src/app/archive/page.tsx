import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { getArchive } from "@/lib/api";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Archive",
  description: "Past OUDYN references, kept as a record. No longer in production.",
};

export default async function ArchivePage() {
  const items = await getArchive();
  const years = items.map((item) => item.archiveYear).filter(Boolean).sort();

  return (
    <main id="main" className="pageMain">
      <div className="container">
        <PageHeader
          title="Archive"
          intro="Series that have left production. They remain here as a record of the drawing, the specification and the number of pieces made — not as a shop."
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
            Archived references are not reissued. Replacement straps, crystals and gaskets remain
            available while stock lasts; movements can still be serviced at the Milano workshop.
            Write to <a href="mailto:studio@oudyn.com">studio@oudyn.com</a> with the reference
            number engraved on the caseback.
          </p>
        </div>
      </div>
    </main>
  );
}
