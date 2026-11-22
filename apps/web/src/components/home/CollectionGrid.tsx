import Link from "next/link";
import Image from "next/image";
import type { CollectionWithCount } from "@oudyn/contracts";
import styles from "./CollectionGrid.module.css";

type Tile = {
  collection: CollectionWithCount;
  image: string;
};

export function CollectionGrid({ tiles }: { tiles: Tile[] }) {
  return (
    <section className={styles.section} aria-labelledby="collections-title">
      <div className="container">
        <div className={styles.head}>
          <h2 id="collections-title" className={styles.title}>
            Shop by family
          </h2>
          <Link href="/watches" className="textLink">
            All watches
          </Link>
        </div>

        <div className={styles.grid}>
          {tiles.map(({ collection, image }, index) => (
            <Link
              key={collection.handle}
              href={`/collections/${collection.handle}`}
              className={styles.tile}
              aria-label={`${collection.title}, ${collection.count} pieces`}
            >
              <div className={styles.media}>
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 50vw, 50vw"
                  className={styles.image}
                />
              </div>
              <div className={styles.top}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{String(collection.count).padStart(2, "0")} pieces</span>
              </div>
              <div className={styles.bottom}>
                <span className={styles.name}>{collection.title}</span>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
          {tiles.length < 4 && (
            <Link href="/sell" className={styles.tile} aria-label="Sell your watch to OUDYN">
              <div className={styles.media}>
                <Image
                  src="/images/rolex/rolex-white.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 767px) 50vw, 50vw"
                  className={styles.image}
                />
              </div>
              <div className={styles.top}>
                <span>{String(tiles.length + 1).padStart(2, "0")}</span>
                <span>Private sale</span>
              </div>
              <div className={styles.bottom}>
                <span className={styles.name}>Sell your watch</span>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
